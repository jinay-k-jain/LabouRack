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


# ── Helper: create all tables ─────────────────────────────────────────────────
async def init_db() -> None:
    """Create all tables on startup (dev convenience — use Alembic in prod)."""
    # Import all models so Base knows about them
    from app.models import user, booking, job  # noqa: F401
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
