"""Workers router — registration, profile, online toggle, job requests."""

import json
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import List, Optional

from app.core.deps import get_db, get_current_user, require_worker, require_admin
from app.core.redis_client import set_worker_online, set_worker_offline, get_online_workers
from app.core.security import hash_password
from app.models.user import User, WorkerProfile, UserRole, VerificationStatus
from app.models.booking import Booking, BookingStatus
from app.models.job import JobRequest, JobStatus

router = APIRouter(prefix="/workers", tags=["Workers"])


# ── Schemas ───────────────────────────────────────────────────────────────────
class WorkerRegisterRequest(BaseModel):
    name: str
    dob: Optional[str] = None
    gender: Optional[str] = None
    phone: str
    email: Optional[str] = None
    languages: Optional[List[str]] = []
    house_no: Optional[str] = None
    street: str
    landmark: Optional[str] = None
    locality: Optional[str] = None
    city: str
    pincode: str
    state: str
    aadhaar_number: str      # hashed before storage — never stored plain
    pan_card: Optional[str] = None
    service_categories: List[str]
    skills: Optional[List[str]] = []
    experience_level: str
    experience_desc: Optional[str] = None
    available_from: Optional[str] = "08:00"
    available_to: Optional[str] = "20:00"


class EstimateRequest(BaseModel):
    job_id: str
    labour_charge: float
    materials_cost: float
    visiting_fee: float = 69.0
    discount: float = 0.0
    inspection_notes: Optional[str] = None
    materials_needed: Optional[List[dict]] = []


async def get_worker_profile(db: AsyncSession, user_id: str) -> WorkerProfile:
    result = await db.execute(select(WorkerProfile).where(WorkerProfile.user_id == user_id))
    profile = result.scalar_one_or_none()
    if not profile:
        raise HTTPException(status_code=404, detail="Worker profile not found.")
    return profile


def job_response(job: JobRequest, booking: Booking | None) -> dict:
    return {
        "id": job.id,
        "booking_id": job.booking_id,
        "status": job.status.value,
        "issue": job.issue,
        "category": job.category,
        "customer_name": job.customer_name,
        "address": job.address,
        "description": booking.description if booking else None,
        "time_slot": booking.time_slot if booking else None,
        "distance_km": job.distance_km,
        "urgency": job.urgency,
        "inspection_notes": job.inspection_notes,
        "materials_needed": json.loads(job.materials_needed or "[]"),
        "labour_charge": job.labour_charge,
        "materials_cost": job.materials_cost,
        "visiting_fee": job.visiting_fee,
        "estimate_discount": job.estimate_discount,
        "estimated_total": job.estimated_total,
        "customer_decision": job.customer_decision,
        "customer_feedback": job.customer_feedback,
        "customer_counter_offer": job.customer_counter_offer,
        "estimate_sent_at": job.estimate_sent_at,
        "customer_decision_at": job.customer_decision_at,
        "dispatched_at": job.dispatched_at,
    }


# ── Register (create profile) ─────────────────────────────────────────────────
@router.post("/register", status_code=201, summary="Register a new worker profile")
async def register_worker(
    body: WorkerRegisterRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Update user record
    current_user.name = body.name
    current_user.email = body.email
    current_user.role = UserRole.worker

    profile = WorkerProfile(
        user_id=current_user.id,
        dob=body.dob,
        gender=body.gender,
        languages=json.dumps(body.languages),
        house_no=body.house_no,
        street=body.street,
        landmark=body.landmark,
        locality=body.locality,
        city=body.city,
        pincode=body.pincode,
        state=body.state,
        aadhaar_hash=hash_password(body.aadhaar_number),  # bcrypt — never plain
        pan_card=body.pan_card,
        service_categories=json.dumps(body.service_categories),
        skills=json.dumps(body.skills),
        experience_level=body.experience_level,
        experience_desc=body.experience_desc,
        available_from=body.available_from,
        available_to=body.available_to,
        verification_status=VerificationStatus.pending,
    )
    db.add(profile)
    return {"message": "Profile submitted. Pending admin approval.", "user_id": current_user.id}


# ── My Profile ────────────────────────────────────────────────────────────────
@router.get("/me", summary="Get current worker's profile")
async def get_my_profile(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_worker),
):
    result = await db.execute(
        select(WorkerProfile).where(WorkerProfile.user_id == current_user.id)
    )
    profile = result.scalar_one_or_none()
    if not profile:
        raise HTTPException(status_code=404, detail="Worker profile not found.")
    return profile


# ── Online Toggle ─────────────────────────────────────────────────────────────
@router.post("/me/online", summary="Set worker status to Online")
async def go_online(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_worker),
):
    profile = await get_worker_profile(db, current_user.id)
    profile.is_online = True
    await set_worker_online(current_user.id)
    return {"status": "online"}


@router.post("/me/offline", summary="Set worker status to Offline")
async def go_offline(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_worker),
):
    profile = await get_worker_profile(db, current_user.id)
    profile.is_online = False
    await set_worker_offline(current_user.id)
    return {"status": "offline"}


# ── Job Requests ──────────────────────────────────────────────────────────────
@router.get("/me/jobs", summary="Get job requests for current worker")
async def get_my_jobs(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_worker),
):
    profile = await get_worker_profile(db, current_user.id)
    result = await db.execute(
        select(JobRequest, Booking)
        .join(Booking, Booking.id == JobRequest.booking_id)
        .where(JobRequest.worker_id == profile.id)
        .order_by(JobRequest.dispatched_at.desc())
    )
    return [job_response(job, booking) for job, booking in result.all()]


@router.post("/me/jobs/{job_id}/accept", summary="Accept a job request")
async def accept_job(
    job_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_worker),
):
    profile = await get_worker_profile(db, current_user.id)
    result = await db.execute(select(JobRequest).where(JobRequest.id == job_id, JobRequest.worker_id == profile.id))
    job = result.scalar_one_or_none()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found.")
    job.status = JobStatus.accepted
    job.accepted_at = datetime.now(timezone.utc)
    return {"message": "Job accepted.", "job_id": job_id}


@router.post("/me/jobs/{job_id}/reject", summary="Reject a job request")
async def reject_job(
    job_id: str,
    reason: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_worker),
):
    profile = await get_worker_profile(db, current_user.id)
    result = await db.execute(select(JobRequest).where(JobRequest.id == job_id, JobRequest.worker_id == profile.id))
    job = result.scalar_one_or_none()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found.")
    job.status = JobStatus.rejected
    job.rejection_reason = reason
    return {"message": "Job rejected.", "job_id": job_id}


@router.post("/me/jobs/{job_id}/estimate", summary="Submit price estimate after on-site inspection")
async def submit_estimate(
    body: EstimateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_worker),
):
    profile = await get_worker_profile(db, current_user.id)
    result = await db.execute(select(JobRequest).where(JobRequest.id == body.job_id, JobRequest.worker_id == profile.id))
    job = result.scalar_one_or_none()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found.")

    job.labour_charge     = body.labour_charge
    job.materials_cost    = body.materials_cost
    job.visiting_fee      = body.visiting_fee
    job.estimate_discount = body.discount
    job.estimated_total   = body.labour_charge + body.materials_cost + body.visiting_fee - body.discount
    job.inspection_notes  = body.inspection_notes
    job.materials_needed  = json.dumps(body.materials_needed)
    job.status            = JobStatus.estimate_sent
    job.estimate_sent_at  = datetime.now(timezone.utc)

    return {
        "message": "Estimate sent to customer.",
        "total": job.estimated_total,
        "job_id": body.job_id,
    }


@router.get("/available", summary="Discover available Dhanbad workers by household category")
async def available_workers(
    category: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(WorkerProfile, User.name)
        .join(User, User.id == WorkerProfile.user_id)
        .where(
            WorkerProfile.city.ilike("Dhanbad"),
            WorkerProfile.is_online.is_(True),
            WorkerProfile.verification_status == VerificationStatus.approved,
        )
        .order_by(WorkerProfile.rating.desc(), WorkerProfile.review_count.desc())
    )
    workers = []
    for profile, name in result.all():
        categories = json.loads(profile.service_categories or "[]")
        if category and category.lower() not in [item.lower() for item in categories]:
            continue
        workers.append({
            "id": profile.id,
            "name": name,
            "city": profile.city,
            "locality": profile.locality,
            "categories": categories,
            "skills": json.loads(profile.skills or "[]"),
            "rating": profile.rating,
            "review_count": profile.review_count,
            "is_online": profile.is_online,
        })
    return workers


# ── Admin: list all workers ───────────────────────────────────────────────────
@router.get("/", summary="[Admin] List all worker profiles")
async def list_workers(
    status: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    query = select(WorkerProfile)
    if status:
        query = query.where(WorkerProfile.verification_status == status)
    result = await db.execute(query)
    return result.scalars().all()


@router.post("/{worker_id}/approve", summary="[Admin] Approve worker")
async def approve_worker(
    worker_id: str,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    result = await db.execute(select(WorkerProfile).where(WorkerProfile.id == worker_id))
    profile = result.scalar_one_or_none()
    if not profile:
        raise HTTPException(status_code=404, detail="Worker profile not found.")
    profile.verification_status = VerificationStatus.approved
    return {"message": "Worker approved.", "worker_id": worker_id}


@router.post("/{worker_id}/reject", summary="[Admin] Reject worker")
async def reject_worker(
    worker_id: str,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    result = await db.execute(select(WorkerProfile).where(WorkerProfile.id == worker_id))
    profile = result.scalar_one_or_none()
    if not profile:
        raise HTTPException(status_code=404, detail="Worker profile not found.")
    profile.verification_status = VerificationStatus.rejected
    return {"message": "Worker rejected.", "worker_id": worker_id}
