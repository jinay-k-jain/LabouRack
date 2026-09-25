"""SQLAlchemy models — Bookings."""

from sqlalchemy import Column, String, Float, DateTime, Text, Enum as SAEnum, ForeignKey
from datetime import datetime, timezone
import enum
import uuid

from app.database import Base


def utcnow():
    return datetime.now(timezone.utc)


class BookingStatus(str, enum.Enum):
    pending = "pending"
    confirmed = "confirmed"
    worker_dispatched = "worker_dispatched"
    in_progress = "in_progress"
    completed = "completed"
    cancelled = "cancelled"


class PaymentMethod(str, enum.Enum):
    upi = "upi"
    card = "card"
    netbanking = "netbanking"
    cod = "cod"


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))

    # Parties
    customer_id = Column(String, ForeignKey("customer_profiles.id"), nullable=False, index=True)
    worker_id = Column(String, ForeignKey("worker_profiles.id"), nullable=True, index=True)   # set after assignment

    # Service details
    issue = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String(100), nullable=True)
    address = Column(Text, nullable=False)
    locality = Column(String(255), nullable=True)

    # Schedule
    time_slot = Column(String(100), nullable=True)

    # Pricing
    base_rate = Column(Float, nullable=True)
    materials_cost = Column(Float, default=0.0)
    safety_fee = Column(Float, default=20.0)
    discount = Column(Float, default=0.0)
    total_amount = Column(Float, nullable=True)

    # Payment
    payment_method = Column(SAEnum(PaymentMethod), nullable=True)
    payment_status = Column(String(50), default="pending")

    # Status
    status = Column(SAEnum(BookingStatus), default=BookingStatus.pending)
    otp_code = Column(String(10), nullable=True)        # 4-digit dispatch OTP
    worker_eta_minutes = Column(Float, nullable=True)
    cancellation_reason = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), default=utcnow)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)
    completed_at = Column(DateTime(timezone=True), nullable=True)

    from sqlalchemy.orm import relationship
    customer = relationship("CustomerProfile", back_populates="bookings")
    job_requests = relationship("JobRequest", back_populates="booking")
