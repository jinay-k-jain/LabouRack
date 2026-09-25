"""Bookings router — create, list, update, cancel bookings."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import Literal, Optional
from datetime import datetime, timezone

from app.core.deps import get_db, get_current_user, require_customer, require_any
from app.models.user import CustomerProfile, User, WorkerProfile
from app.models.booking import Booking, BookingStatus, PaymentMethod
from app.models.job import JobRequest, JobStatus
from app.utils.otp import generate_dispatch_otp
from app.services.matching import assign_booking

router = APIRouter(prefix="/bookings", tags=["Bookings"])


# ── Schemas ───────────────────────────────────────────────────────────────────
class CreateBookingRequest(BaseModel):
    issue: str
    description: Optional[str] = None
    category: str
    address: str
    locality: Optional[str] = None
    time_slot: Optional[str] = None
    payment_method: Optional[str] = "upi"
    selected_worker_id: Optional[str] = None
    express: bool = False


class CancelBookingRequest(BaseModel):
    reason: Optional[str] = None


class EstimateDecisionRequest(BaseModel):
    decision: Literal["accepted", "rejected", "counter_offer"]
    feedback: Optional[str] = None
    counter_offer: Optional[float] = None


# ── Create booking ─────────────────────────────────────────────────────────────
@router.post("/", status_code=201, summary="Customer creates a booking")
async def create_booking(
    body: CreateBookingRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_customer),
):
    # Find customer profile id
    result = await db.execute(
        select(CustomerProfile).where(CustomerProfile.user_id == current_user.id)
    )
    customer = result.scalar_one_or_none()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer profile not found.")

    otp = generate_dispatch_otp()
    booking = Booking(
        customer_id=customer.id,
        issue=body.issue,
        description=body.description,
        category=body.category,
        address=body.address,
        locality=body.locality,
        time_slot=body.time_slot,
        payment_method=PaymentMethod(body.payment_method) if body.payment_method else PaymentMethod.upi,
        otp_code=otp,
        status=BookingStatus.pending,
    )
    db.add(booking)
    await db.flush()
    await db.refresh(booking)

    worker, job = await assign_booking(
        db,
        booking,
        customer,
        current_user,
        selected_worker_id=body.selected_worker_id,
    )
    if not worker or not job:
        message = "The selected worker is unavailable for this category." if body.selected_worker_id else "No available Dhanbad worker matches this category."
        raise HTTPException(status_code=409, detail=message)

    return {
        "message": "Booking sent directly to the selected worker." if body.selected_worker_id else "Express Book assigned the best available Dhanbad worker.",
        "booking_id": booking.id,
        "job_id": job.id,
        "assignment_type": "selected_worker" if body.selected_worker_id else "express",
        "assigned_worker": {"id": worker.id, "name": (await db.execute(select(User.name).where(User.id == worker.user_id))).scalar_one()},
        "dispatch_otp": otp,   # Share with worker at arrival for verification
        "status": booking.status.value,
    }


# ── List my bookings ──────────────────────────────────────────────────────────
@router.get("/me", summary="Get all bookings for the current customer")
async def list_my_bookings(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_customer),
):
    result = await db.execute(
        select(CustomerProfile).where(CustomerProfile.user_id == current_user.id)
    )
    customer = result.scalar_one_or_none()
    if not customer:
        return []

    result = await db.execute(
        select(Booking)
        .where(Booking.customer_id == customer.id)
        .order_by(Booking.created_at.desc())
    )
    bookings = result.scalars().all()
    response = []
    for booking in bookings:
        job_result = await db.execute(select(JobRequest).where(JobRequest.booking_id == booking.id))
        job = job_result.scalar_one_or_none()
        worker_name = None
        if job:
            worker_result = await db.execute(
                select(User.name)
                .join(WorkerProfile, WorkerProfile.user_id == User.id)
                .where(WorkerProfile.id == job.worker_id)
            )
            worker_name = worker_result.scalar_one_or_none()
        response.append({
            "booking": booking,
            "job": job,
            "worker_name": worker_name,
            "estimate_available": bool(job and job.status in (JobStatus.estimate_sent, JobStatus.confirmed, JobStatus.counter_offered, JobStatus.estimate_rejected)),
        })
    return response


# ── Get single booking ────────────────────────────────────────────────────────
@router.get("/{booking_id}", summary="Get booking details")
async def get_booking(
    booking_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_any),
):
    result = await db.execute(select(Booking).where(Booking.id == booking_id))
    booking = result.scalar_one_or_none()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found.")
    customer_result = await db.execute(select(CustomerProfile).where(CustomerProfile.user_id == current_user.id))
    customer = customer_result.scalar_one_or_none()
    worker_result = await db.execute(select(WorkerProfile).where(WorkerProfile.user_id == current_user.id))
    worker = worker_result.scalar_one_or_none()
    if not (customer and booking.customer_id == customer.id) and not (worker and booking.worker_id == worker.id):
        raise HTTPException(status_code=403, detail="You do not have access to this booking.")
    job_result = await db.execute(select(JobRequest).where(JobRequest.booking_id == booking.id))
    return {"booking": booking, "job": job_result.scalar_one_or_none()}


@router.post("/{booking_id}/estimate-decision", summary="Customer accepts, rejects, or counters a worker estimate")
async def decide_estimate(
    booking_id: str,
    body: EstimateDecisionRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_customer),
):
    customer_result = await db.execute(select(CustomerProfile).where(CustomerProfile.user_id == current_user.id))
    customer = customer_result.scalar_one_or_none()
    booking_result = await db.execute(select(Booking).where(Booking.id == booking_id))
    booking = booking_result.scalar_one_or_none()
    if not booking or not customer or booking.customer_id != customer.id:
        raise HTTPException(status_code=404, detail="Booking not found.")

    job_result = await db.execute(select(JobRequest).where(JobRequest.booking_id == booking_id))
    job = job_result.scalar_one_or_none()
    if not job or job.estimated_total is None:
        raise HTTPException(status_code=400, detail="There is no worker estimate to respond to yet.")
    if body.decision == "counter_offer" and (body.counter_offer is None or body.counter_offer < 0):
        raise HTTPException(status_code=422, detail="A valid counter offer is required.")

    job.customer_decision = body.decision
    job.customer_feedback = body.feedback
    job.customer_counter_offer = body.counter_offer if body.decision == "counter_offer" else None
    job.customer_decision_at = datetime.now(timezone.utc)
    if body.decision == "accepted":
        job.status = JobStatus.confirmed
        booking.status = BookingStatus.confirmed
    elif body.decision == "rejected":
        job.status = JobStatus.estimate_rejected
    else:
        job.status = JobStatus.counter_offered

    return {
        "message": f"Estimate {body.decision.replace('_', ' ')} and shared with the worker.",
        "booking_id": booking.id,
        "job_id": job.id,
        "status": job.status.value,
    }


# ── Cancel booking ────────────────────────────────────────────────────────────
@router.post("/{booking_id}/cancel", summary="Cancel a booking")
async def cancel_booking(
    booking_id: str,
    body: CancelBookingRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_any),
):
    result = await db.execute(select(Booking).where(Booking.id == booking_id))
    booking = result.scalar_one_or_none()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found.")
    if booking.status in (BookingStatus.completed, BookingStatus.cancelled):
        raise HTTPException(status_code=400, detail=f"Booking already {booking.status.value}.")
    booking.status = BookingStatus.cancelled
    booking.cancellation_reason = body.reason
    return {"message": "Booking cancelled.", "booking_id": booking_id}


# ── Complete booking ──────────────────────────────────────────────────────────
@router.post("/{booking_id}/complete", summary="Mark booking as completed")
async def complete_booking(
    booking_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_any),
):
    result = await db.execute(select(Booking).where(Booking.id == booking_id))
    booking = result.scalar_one_or_none()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found.")
    booking.status = BookingStatus.completed
    booking.completed_at = datetime.now(timezone.utc)
    return {"message": "Booking marked as completed.", "booking_id": booking_id}
