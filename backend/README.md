# LabouRack — Backend API

FastAPI backend for the LabouRack hyperlocal gig-work platform.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | FastAPI + Uvicorn |
| Database | SQLite (async via aiosqlite + SQLAlchemy 2.0) |
| Auth | JWT (python-jose) — OTP + Bearer token |
| Cache / Pub-Sub | Redis (redis-py async) |
| Background Tasks | Celery + Redis broker |
| WebSockets | FastAPI built-in (real-time job dispatch) |

## Project Structure

```
backend/
├── run.py                    # Dev server entry point
├── requirements.txt
├── .env                      # Dev environment (created from .env.example)
├── .env.example
└── app/
    ├── main.py               # FastAPI app + lifespan + CORS
    ├── config.py             # Pydantic settings
    ├── database.py           # SQLAlchemy async engine
    ├── models/               # SQLAlchemy ORM models
    │   ├── user.py           # User, CustomerProfile, WorkerProfile
    │   ├── booking.py        # Booking
    │   └── job.py            # JobRequest (worker-side)
    ├── routers/              # API route handlers
    │   ├── auth.py           # POST /auth/send-otp, /verify-otp, /admin-login, /refresh
    │   ├── workers.py        # CRUD + job accept/reject/estimate
    │   ├── bookings.py       # Create / list / cancel / complete
    │   └── ws.py             # WebSocket /ws?token=<jwt>
    ├── core/
    │   ├── security.py       # JWT create/verify, bcrypt
    │   ├── redis_client.py   # Redis helpers + OTP store
    │   └── deps.py           # FastAPI dependencies (DB session, auth guards)
    ├── tasks/
    │   ├── celery_app.py     # Celery configuration
    │   ├── notifications.py  # send_otp_sms, send_booking_confirmation
    │   └── job_dispatch.py   # dispatch_job_to_nearby_workers, auto_assign
    └── utils/
        └── otp.py            # OTP generator
```

## Quick Start

### 1. Activate virtual environment
```powershell
# Windows
.venv\Scripts\activate
```

### 2. Start the API server
```powershell
python run.py
# → http://localhost:8000
# → API Docs: http://localhost:8000/docs
```

### 3. Start Celery worker (new terminal, venv active)
```powershell
celery -A app.tasks.celery_app worker --loglevel=info --pool=solo
```

### 4. Start Celery Beat scheduler (new terminal, venv active)
```powershell
celery -A app.tasks.celery_app beat --loglevel=info
```

> **Redis**: Celery requires Redis running on `localhost:6379`.  
> Install via Docker: `docker run -d -p 6379:6379 redis:alpine`  
> Or download Redis for Windows from https://github.com/tporadowski/redis/releases

---

## API Endpoints

### Auth
| Method | Path | Description |
|---|---|---|
| POST | `/auth/send-otp` | Send OTP to phone (returns OTP in DEBUG mode) |
| POST | `/auth/verify-otp` | Verify OTP → access + refresh tokens |
| POST | `/auth/admin-login` | Admin login with username + password |
| POST | `/auth/refresh` | Refresh access token |

### Workers
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/workers/register` | Worker JWT | Submit registration profile |
| GET | `/workers/me` | Worker JWT | Get own profile |
| POST | `/workers/me/online` | Worker JWT | Go online (Redis) |
| POST | `/workers/me/offline` | Worker JWT | Go offline |
| GET | `/workers/me/jobs` | Worker JWT | List job requests |
| POST | `/workers/me/jobs/{id}/accept` | Worker JWT | Accept job |
| POST | `/workers/me/jobs/{id}/reject` | Worker JWT | Reject job |
| POST | `/workers/me/jobs/{id}/estimate` | Worker JWT | Submit price estimate |
| GET | `/workers/` | Admin JWT | List all workers |
| POST | `/workers/{id}/approve` | Admin JWT | Approve worker |
| POST | `/workers/{id}/reject` | Admin JWT | Reject worker |

### Bookings
| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/bookings/` | Customer JWT | Create booking + dispatch workers |
| GET | `/bookings/me` | Customer JWT | List own bookings |
| GET | `/bookings/{id}` | Any JWT | Get booking details |
| POST | `/bookings/{id}/cancel` | Any JWT | Cancel booking |
| POST | `/bookings/{id}/complete` | Any JWT | Mark completed |

### WebSocket
```
ws://localhost:8000/ws?token=<jwt_access_token>
```

Client → Server messages:
```json
{"type": "ping"}
{"type": "worker:online"}
{"type": "worker:offline"}
```

Server → Client pushes:
```json
{"type": "job:new",        "data": {...}}
{"type": "booking:update", "data": {...}}
{"type": "estimate:reply", "data": {...}}
```

---

## Environment Variables

See [`.env.example`](.env.example) for all available settings.
