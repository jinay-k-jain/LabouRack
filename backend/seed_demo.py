import asyncio
from app.database import AsyncSessionLocal, init_db
from app.models.user import User, UserRole, CustomerProfile, WorkerProfile, VerificationStatus
from sqlalchemy import select, delete
from app.core.security import hash_password
import json


async def seed():
    await init_db()
    async with AsyncSessionLocal() as s:
        # Clear existing test records
        await s.execute(delete(User).where(User.phone.in_(["9876543210", "9812345678", "0000000000"])))
        await s.commit()

        # 1. Customer
        cust = User(phone="9876543210", name="Rahul Sharma", role=UserRole.customer, email="rahul@example.com")
        s.add(cust)
        await s.flush()
        cust_p = CustomerProfile(user_id=cust.id, address="Flat 402, Green Glen Heights, HSR Layout", locality="HSR Layout", city="Bengaluru", pincode="560102")
        s.add(cust_p)

        # 2. Worker
        worker = User(phone="9812345678", name="Rohit Kumar", role=UserRole.worker, email="rohit@example.com")
        s.add(worker)
        await s.flush()
        worker_p = WorkerProfile(
            user_id=worker.id,
            locality="Indiranagar",
            city="Bengaluru",
            pincode="560038",
            state="Karnataka",
            aadhaar_hash=hash_password("123456789012"),
            aadhaar_verified=True,
            service_categories=json.dumps(["electrical", "plumbing"]),
            skills=json.dumps(["Electrician", "Plumber"]),
            experience_level="expert",
            experience_desc="8+ years fixing electrical wiring and plumbing",
            is_online=True,
            verification_status=VerificationStatus.approved,
            rating=4.9,
            review_count=142,
            completed_jobs=320,
            total_earnings=48500.0,
        )
        s.add(worker_p)

        # 3. Admin
        adm = User(phone="0000000000", name="LabouRack Admin", role=UserRole.admin, email="admin@labourack.in")
        s.add(adm)
        await s.commit()
    print("DEMO_ACCOUNTS_INITIALIZED_CLEANLY")


if __name__ == "__main__":
    asyncio.run(seed())
