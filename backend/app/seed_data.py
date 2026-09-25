"""Idempotent local demo data used by the development backend."""

import json

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import hash_password
from app.models.user import CustomerProfile, User, UserRole, VerificationStatus, WorkerProfile


DHANBAD_WORKERS = [
    ("Aman Kumar", "9001000001", ["plumbing"], ["Leak repair", "Drain cleaning"], 4.9, 218),
    ("Vikash Singh", "9001000002", ["electrical"], ["Wiring", "Power backup"], 4.8, 195),
    ("Neha Verma", "9001000003", ["electronics"], ["AC repair", "Appliance diagnostics"], 4.9, 176),
    ("Pankaj Das", "9001000004", ["carpentry"], ["Furniture repair", "Door fittings"], 4.7, 149),
    ("Priya Kumari", "9001000005", ["cleaning"], ["Kitchen cleaning", "Bathroom cleaning"], 4.9, 231),
    ("Rakesh Mahto", "9001000006", ["painting"], ["Interior painting", "Wall repairs"], 4.7, 137),
    ("Imran Ansari", "9001000007", ["locksmith"], ["Lock repair", "Key replacement"], 4.8, 158),
    ("Sanjay Paswan", "9001000008", ["delivery"], ["Local delivery", "Pickup and drop"], 4.6, 121),
    ("Deepak Sharma", "9001000009", ["plumbing", "electrical"], ["Pipe repair", "Switch repair"], 4.8, 204),
    ("Kavita Devi", "9001000010", ["cleaning", "painting"], ["Deep cleaning", "Touch-ups"], 4.8, 189),
    ("Arjun Yadav", "9001000011", ["carpentry", "locksmith"], ["Cabinets", "Door locks"], 4.7, 143),
    ("Nitin Gupta", "9001000012", ["electronics", "delivery"], ["Appliances", "Express delivery"], 4.6, 112),
]


async def seed_demo_data(session: AsyncSession) -> None:
    """Create a Dhanbad customer and 12 available, approved household workers."""
    customer_result = await session.execute(select(User).where(User.phone == "9876543210"))
    customer = customer_result.scalar_one_or_none()
    if not customer:
        customer = User(
            phone="9876543210",
            name="Rahul Sharma",
            role=UserRole.customer,
            email="rahul.sharma@example.com",
        )
        session.add(customer)
        await session.flush()

    profile_result = await session.execute(select(CustomerProfile).where(CustomerProfile.user_id == customer.id))
    customer_profile = profile_result.scalar_one_or_none()
    if not customer_profile:
        session.add(CustomerProfile(
            user_id=customer.id,
            address="Bank More, Dhanbad",
            locality="Bank More",
            city="Dhanbad",
            pincode="826001",
        ))
    else:
        customer_profile.address = "Bank More, Dhanbad"
        customer_profile.locality = "Bank More"
        customer_profile.city = "Dhanbad"
        customer_profile.pincode = "826001"

    for index, (name, phone, categories, skills, rating, reviews) in enumerate(DHANBAD_WORKERS, start=1):
        user_result = await session.execute(select(User).where(User.phone == phone))
        worker_user = user_result.scalar_one_or_none()
        if not worker_user:
            worker_user = User(
                phone=phone,
                name=name,
                role=UserRole.worker,
                email=f"{phone}@demo.labourack.in",
            )
            session.add(worker_user)
            await session.flush()

        worker_result = await session.execute(
            select(WorkerProfile).where(WorkerProfile.user_id == worker_user.id)
        )
        if not worker_result.scalar_one_or_none():
            session.add(WorkerProfile(
                user_id=worker_user.id,
                locality="Bank More" if index % 2 else "Hirapur",
                city="Dhanbad",
                pincode="826001",
                state="Jharkhand",
                aadhaar_hash=hash_password(f"1000000000{index:02d}"),
                aadhaar_verified=True,
                service_categories=json.dumps(categories),
                skills=json.dumps(skills),
                experience_level="expert" if rating >= 4.8 else "intermediate",
                experience_desc=f"Experienced Dhanbad {categories[0]} professional.",
                is_online=True,
                verification_status=VerificationStatus.approved,
                rating=rating,
                review_count=reviews,
                completed_jobs=reviews + 80,
                total_earnings=float((reviews + 80) * 350),
            ))

    admin_result = await session.execute(select(User).where(User.phone == "0000000000"))
    if not admin_result.scalar_one_or_none():
        session.add(User(
            phone="0000000000",
            name="LabouRack Admin",
            role=UserRole.admin,
            email="admin@labourack.in",
        ))
