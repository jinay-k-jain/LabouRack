"""Worker matching and job creation for customer bookings."""

import json

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.booking import Booking, BookingStatus
from app.models.job import JobRequest, JobStatus
from app.models.user import CustomerProfile, User, VerificationStatus, WorkerProfile


def _categories(profile: WorkerProfile) -> list[str]:
    try:
        return [str(item).lower() for item in json.loads(profile.service_categories or "[]")]
    except json.JSONDecodeError:
        return []


async def find_matching_worker(
    db: AsyncSession,
    category: str,
    selected_worker_id: str | None = None,
) -> WorkerProfile | None:
    """Find a selected pro or the best available Dhanbad pro for a category."""
    category = category.strip().lower()
    if selected_worker_id:
        result = await db.execute(
            select(WorkerProfile).where(
                WorkerProfile.id == selected_worker_id,
                WorkerProfile.verification_status == VerificationStatus.approved,
            )
        )
        worker = result.scalar_one_or_none()
        if worker and category in _categories(worker):
            return worker
        return None

    result = await db.execute(
        select(WorkerProfile)
        .where(
            WorkerProfile.city.ilike("Dhanbad"),
            WorkerProfile.is_online.is_(True),
            WorkerProfile.verification_status == VerificationStatus.approved,
        )
        .order_by(WorkerProfile.rating.desc(), WorkerProfile.review_count.desc())
    )
    return next((worker for worker in result.scalars() if category in _categories(worker)), None)


async def assign_booking(
    db: AsyncSession,
    booking: Booking,
    customer: CustomerProfile,
    customer_user: User,
    selected_worker_id: str | None = None,
) -> tuple[WorkerProfile | None, JobRequest | None]:
    """Assign a booking and create the worker-facing request in one transaction."""
    worker = await find_matching_worker(db, booking.category or "", selected_worker_id)
    if not worker:
        return None, None

    booking.worker_id = worker.id
    booking.status = BookingStatus.worker_dispatched
    booking.worker_eta_minutes = 15
    job = JobRequest(
        booking_id=booking.id,
        worker_id=worker.id,
        issue=booking.issue,
        category=booking.category,
        customer_name=customer_user.name,
        address=booking.address,
        distance_km=2.0,
        urgency="urgent" if "urgent" in (booking.issue or "").lower() else "normal",
        status=JobStatus.new,
    )
    db.add(job)
    await db.flush()
    return worker, job
