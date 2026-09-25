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
    from sqlalchemy import text
    from app.seed_data import seed_demo_data

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        # SQLite does not apply model changes to existing tables. These additive
        # columns preserve local demo data while enabling estimate decisions.
        result = await conn.execute(text("PRAGMA table_info(job_requests)"))
        existing_columns = {row[1] for row in result}
        additions = {
            "estimate_discount": "FLOAT DEFAULT 0",
            "customer_decision": "VARCHAR(30)",
            "customer_feedback": "TEXT",
            "customer_counter_offer": "FLOAT",
            "customer_decision_at": "DATETIME",
        }
        for name, definition in additions.items():
            if name not in existing_columns:
                await conn.execute(text(f"ALTER TABLE job_requests ADD COLUMN {name} {definition}"))

    # Seed demo users for immediate testing
    async with AsyncSessionLocal() as session:
        await seed_demo_data(session)
        await session.commit()
