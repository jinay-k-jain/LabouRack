"""
LabouRack FastAPI Application Entry Point
=========================================
Tech Stack:
  - FastAPI  — REST API + WebSockets
  - SQLAlchemy (async) + SQLite (aiosqlite)
  - JWT (python-jose) — Authentication
  - Redis (redis-py async) — OTP store, online worker set, caching
  - Celery (+ Redis broker) — Background tasks (OTP SMS, job dispatch)
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import settings
from app.database import init_db
from app.core.redis_client import get_redis, close_redis

# ── Routers ───────────────────────────────────────────────────────────────────
from app.routers import auth, workers, bookings, ws


# ── Lifespan (startup / shutdown) ─────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print(f"\n🚀  Starting {settings.APP_NAME} v{settings.APP_VERSION}")
    print(f"    ENV  : {settings.ENVIRONMENT}")
    print(f"    DEBUG: {settings.DEBUG}")

    # Init SQLite tables
    await init_db()
    print("    ✅  Database tables ready")

    # Warm up Redis connection
    try:
        r = await get_redis()
        await r.ping()
        print("    ✅  Redis connected")
    except Exception as e:
        print(f"    ⚠️  Redis unavailable (Celery tasks will be deferred): {e}")

    yield  # ← app runs here

    # Shutdown
    await close_redis()
    print("\n👋  LabouRack API shut down gracefully.")


# ── Application ───────────────────────────────────────────────────────────────
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="""
## LabouRack Backend API

Hyperlocal gig-work platform connecting households with verified local workers.

### Authentication
Use **`POST /auth/send-otp`** → **`POST /auth/verify-otp`** to get a JWT Bearer token.  
Admin: **`POST /auth/admin-login`** with username + password.

### Real-time
Connect via **`WebSocket /ws?token=<jwt>`** for live job notifications.
    """,
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# ── CORS ──────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routes ────────────────────────────────────────────────────────────────────
app.include_router(auth.router)
app.include_router(workers.router)
app.include_router(bookings.router)
app.include_router(ws.router)


# ── Health check ──────────────────────────────────────────────────────────────
@app.get("/", tags=["Health"], summary="Health check")
async def root():
    return {
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "running",
        "docs": "/docs",
        "ws": "ws://localhost:8000/ws?token=<jwt>",
    }


@app.get("/health", tags=["Health"], summary="Detailed health check")
async def health():
    redis_ok = False
    try:
        r = await get_redis()
        await r.ping()
        redis_ok = True
    except Exception:
        pass

    return {
        "status": "ok",
        "database": "sqlite (async)",
        "redis": "connected" if redis_ok else "unavailable",
        "environment": settings.ENVIRONMENT,
    }
