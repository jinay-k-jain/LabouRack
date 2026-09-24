from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from app.config import settings

# ── Engine ────────────────────────────────────────────────────────────────────
# connect_args is required for SQLite to allow use across threads
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,          # prints SQL in dev
    connect_args={"check_same_thread": False},
)

# ── Session factory ───────────────────────────────────────────────────────────
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)

# ── Base model class ──────────────────────────────────────────────────────────
class Base(DeclarativeBase):
    pass


# ── Helper: create all tables & seed initial demo accounts ───────────────────
async def init_db() -> None:
    """Create all tables and seed initial demo accounts if not present."""
    from app.models import user, booking, job  # noqa: F401
    from sqlalchemy import select

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    # Seed demo users for immediate testing
    async with AsyncSessionLocal() as session:
        # 1. Demo Customer
        res = await session.execute(select(user.User).where(user.User.phone == "9876543210"))
        if not res.scalar_one_or_none():
            demo_cust = user.User(
                phone="9876543210",
                name="Rahul Sharma",
                role=user.UserRole.customer,
                email="rahul.sharma@example.com",
            )
            session.add(demo_cust)
            await session.flush()
            cust_prof = user.CustomerProfile(
                user_id=demo_cust.id,
                address="Flat 402, Green Glen Heights, HSR Layout Sector 2",
                locality="HSR Layout",
                city="Bengaluru",
                pincode="560102",
            )
            session.add(cust_prof)

        # 2. Demo Worker
        res = await session.execute(select(user.User).where(user.User.phone == "9812345678"))
        if not res.scalar_one_or_none():
            demo_worker = user.User(
                phone="9812345678",
                name="Rohit Kumar",
                role=user.UserRole.worker,
                email="rohit.kumar@example.com",
            )
            session.add(demo_worker)
            await session.flush()
            import json
            from app.core.security import hash_password
            worker_prof = user.WorkerProfile(
                user_id=demo_worker.id,
                locality="Indiranagar",
                city="Bengaluru",
                pincode="560038",
                state="Karnataka",
                aadhaar_hash=hash_password("123456789012"),
                aadhaar_verified=True,
                service_categories=json.dumps(["electrical", "plumbing"]),
                skills=json.dumps(["Electrician", "Plumber"]),
                experience_level="expert",
                experience_desc="8+ years fixing electrical wiring and household plumbing",
                is_online=True,
                verification_status=user.VerificationStatus.approved,
                rating=4.9,
                review_count=142,
                completed_jobs=320,
                total_earnings=48500.0,
            )
            session.add(worker_prof)

        # 3. Demo Admin
        res = await session.execute(select(user.User).where(user.User.phone == "0000000000"))
        if not res.scalar_one_or_none():
            demo_admin = user.User(
                phone="0000000000",
                name="LabouRack Admin",
                role=user.UserRole.admin,
                email="admin@labourack.in",
            )
            session.add(demo_admin)

        await session.commit()
