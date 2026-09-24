"""SQLAlchemy models — Users, Customers, Workers."""

from sqlalchemy import (
    Column, String, Boolean, DateTime, Float,
    Integer, Text, Enum as SAEnum, ForeignKey
)
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import enum
import uuid

from app.database import Base


def utcnow():
    return datetime.now(timezone.utc)


class UserRole(str, enum.Enum):
    customer = "customer"
    worker = "worker"
    admin = "admin"


class VerificationStatus(str, enum.Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"


# ── Base User ─────────────────────────────────────────────────────────────────
class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    phone = Column(String(15), unique=True, nullable=False, index=True)
    email = Column(String(255), unique=True, nullable=True)
    name = Column(String(255), nullable=False)
    role = Column(SAEnum(UserRole), nullable=False, default=UserRole.customer)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), default=utcnow)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    # Relationships
    customer_profile = relationship("CustomerProfile", back_populates="user", uselist=False)
    worker_profile = relationship("WorkerProfile", back_populates="user", uselist=False)


# ── Customer Profile ──────────────────────────────────────────────────────────
class CustomerProfile(Base):
    __tablename__ = "customer_profiles"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    address = Column(Text, nullable=True)
    locality = Column(String(255), nullable=True)
    city = Column(String(100), nullable=True)
    pincode = Column(String(10), nullable=True)
    created_at = Column(DateTime(timezone=True), default=utcnow)

    user = relationship("User", back_populates="customer_profile")
    bookings = relationship("Booking", back_populates="customer")


# ── Worker Profile ────────────────────────────────────────────────────────────
class WorkerProfile(Base):
    __tablename__ = "worker_profiles"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)

    # Personal
    dob = Column(String(20), nullable=True)
    gender = Column(String(20), nullable=True)
    languages = Column(Text, nullable=True)   # JSON-serialised list

    # Address
    house_no = Column(String(50), nullable=True)
    street = Column(String(255), nullable=True)
    landmark = Column(String(255), nullable=True)
    locality = Column(String(255), nullable=True)
    city = Column(String(100), nullable=True)
    pincode = Column(String(10), nullable=True)
    state = Column(String(100), nullable=True)

    # KYC
    aadhaar_hash = Column(String(255), nullable=True)  # bcrypt hash — never plain text
    aadhaar_verified = Column(Boolean, default=False)
    pan_card = Column(String(20), nullable=True)

    # Skills
    service_categories = Column(Text, nullable=True)  # JSON list of category IDs
    skills = Column(Text, nullable=True)               # JSON list of skill names
    experience_level = Column(String(50), nullable=True)
    experience_desc = Column(Text, nullable=True)

    # Availability
    available_from = Column(String(10), default="08:00")
    available_to = Column(String(10), default="20:00")
    is_online = Column(Boolean, default=False)

    # Verification & Rating
    verification_status = Column(
        SAEnum(VerificationStatus), default=VerificationStatus.pending
    )
    rating = Column(Float, default=0.0)
    review_count = Column(Integer, default=0)
    completed_jobs = Column(Integer, default=0)
    total_earnings = Column(Float, default=0.0)

    created_at = Column(DateTime(timezone=True), default=utcnow)
    updated_at = Column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    user = relationship("User", back_populates="worker_profile")
    job_requests = relationship("JobRequest", back_populates="worker")
