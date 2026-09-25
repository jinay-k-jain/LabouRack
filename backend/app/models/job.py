"""SQLAlchemy models — Job Requests (worker-facing side of a booking)."""

from sqlalchemy import Column, String, Float, DateTime, Text, Boolean, Enum as SAEnum, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import enum
import uuid

from app.database import Base


def utcnow():
    return datetime.now(timezone.utc)


class JobStatus(str, enum.Enum):
    new = "new"           # just broadcast to nearby workers
    accepted = "accepted" # worker accepted
    rejected = "rejected" # worker rejected
    inspecting = "inspecting"  # worker on-site, inspecting
    estimate_sent = "estimate_sent"  # worker sent price estimate
    confirmed = "confirmed"  # customer confirmed estimate
    counter_offered = "counter_offered"
    estimate_rejected = "estimate_rejected"
    completed = "completed"
    cancelled = "cancelled"


class JobRequest(Base):
    __tablename__ = "job_requests"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    booking_id = Column(String, ForeignKey("bookings.id"), nullable=False, index=True)
    worker_id = Column(String, ForeignKey("worker_profiles.id"), nullable=False, index=True)

    # Job details (copied from booking)
    issue = Column(String(255), nullable=False)
    category = Column(String(100), nullable=True)
    category_icon = Column(String(10), nullable=True)
    customer_name = Column(String(255), nullable=True)
    address = Column(Text, nullable=True)
    distance_km = Column(Float, nullable=True)
    urgency = Column(String(20), default="normal")  # urgent | normal

    # Worker's response
    status = Column(SAEnum(JobStatus), default=JobStatus.new)
    rejection_reason = Column(Text, nullable=True)

    # Inspection & estimate (worker fills in)
    inspection_notes = Column(Text, nullable=True)
    materials_needed = Column(Text, nullable=True)  # JSON list
    labour_charge = Column(Float, nullable=True)
    materials_cost = Column(Float, nullable=True)
    visiting_fee = Column(Float, default=69.0)
    estimate_discount = Column(Float, default=0.0)
    estimated_total = Column(Float, nullable=True)

    # Customer response to the worker's estimate
    customer_decision = Column(String(30), nullable=True)
    customer_feedback = Column(Text, nullable=True)
    customer_counter_offer = Column(Float, nullable=True)

    # Timestamps
    dispatched_at = Column(DateTime(timezone=True), default=utcnow)
    accepted_at = Column(DateTime(timezone=True), nullable=True)
    estimate_sent_at = Column(DateTime(timezone=True), nullable=True)
    customer_decision_at = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)

    worker = relationship("WorkerProfile", back_populates="job_requests")
    booking = relationship("Booking", back_populates="job_requests")
