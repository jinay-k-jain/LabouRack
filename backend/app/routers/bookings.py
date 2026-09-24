"""Bookings router — create, list, update, cancel bookings."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timezone

from app.core.deps import get_db, get_current_user, require_customer, require_any
from app.models.user import User
from app.models.booking import Booking, BookingStatus, PaymentMethod
from app.utils.otp import generate_dispatch_otp
from app.tasks.job_dispatch import dispatch_job_to_nearby_workers

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


class CancelBookingRequest(BaseModel):
    reason: Optional[str] = None


# ── Create booking ─────────────────────────────────────────────────────────────
@router.post("/", status_code=201, summary="Customer creates a booking")
async def create_booking(
    body: CreateBookingRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_customer),
):
    # Find customer profile id
    from app.models.user import CustomerProfile
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

    # Dispatch to nearby workers via Celery (non-blocking)
    dispatch_job_to_nearby_workers.delay(booking.id, body.category, body.locality or "")

    return {
        "message": "Booking created. Finding nearby workers...",
        "booking_id": booking.id,
        "dispatch_otp": otp,   # Share with worker at arrival for verification
        "status": booking.status.value,
    }


# ── List my bookings ──────────────────────────────────────────────────────────
@router.get("/me", summary="Get all bookings for the current customer")
async def list_my_bookings(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_customer),
):
    from app.models.user import CustomerProfile
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
    return result.scalars().all()


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
    return booking


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
