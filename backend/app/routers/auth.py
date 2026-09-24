"""Auth router — send OTP, verify OTP, refresh token, admin login."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel

from app.core.deps import get_db
from app.core.security import create_access_token, create_refresh_token, decode_token, verify_password
from app.core.redis_client import store_otp, get_otp, delete_otp
from app.models.user import User, UserRole
from app.utils.otp import generate_otp
from app.tasks.notifications import send_otp_sms
from app.config import settings

router = APIRouter(prefix="/auth", tags=["Auth"])


# ── Schemas ───────────────────────────────────────────────────────────────────
class SendOtpRequest(BaseModel):
    phone: str
    role: str = "customer"   # customer | worker
    flow: str = "login"      # login | register


class VerifyOtpRequest(BaseModel):
    phone: str
    otp: str
    role: str = "customer"
    flow: str = "login"      # login | register


class AdminLoginRequest(BaseModel):
    username: str
    password: str


class RefreshRequest(BaseModel):
    refresh_token: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user_id: str
    role: str
    name: str


# ── Send OTP ──────────────────────────────────────────────────────────────────
@router.post("/send-otp", summary="Send OTP to phone number")
async def send_otp(body: SendOtpRequest, db: AsyncSession = Depends(get_db)):
    if len(body.phone) != 10 or not body.phone.isdigit():
        raise HTTPException(status_code=422, detail="Enter a valid 10-digit phone number.")

    # Check database existence based on flow
    result = await db.execute(select(User).where(User.phone == body.phone))
    user = result.scalar_one_or_none()

    if body.flow == "login":
        if not user:
            role_label = "Gig Worker" if body.role == "worker" else "Customer"
            raise HTTPException(
                status_code=404,
                detail=f"No registered {role_label} account found with +91{body.phone}. Please register first.",
            )
        if user.role.value != body.role:
            raise HTTPException(
                status_code=400,
                detail=f"This number is registered as '{user.role.value}'. Please select '{user.role.value.capitalize()}' to sign in.",
            )
    elif body.flow == "register":
        if user:
            raise HTTPException(
                status_code=400,
                detail=f"An account already exists with +91{body.phone} ({user.role.value}). Please sign in instead.",
            )

    otp = generate_otp(6)
    await store_otp(body.phone, otp)

    # Dispatch via Celery (non-blocking, safe if Redis is not running)
    try:
        send_otp_sms.delay(body.phone, otp)
    except Exception as e:
        print(f"[DEV] Celery/Redis not reachable for SMS task: {e}. OTP is: {otp}")

    return {
        "message": f"OTP sent to +91{body.phone}",
        # Only exposed in dev mode to ease testing
        "otp": otp if settings.DEBUG else None,
    }


# ── Verify OTP & Issue Tokens ─────────────────────────────────────────────────
@router.post("/verify-otp", response_model=TokenResponse, summary="Verify OTP → JWT tokens")
async def verify_otp(body: VerifyOtpRequest, db: AsyncSession = Depends(get_db)):
    stored = await get_otp(body.phone)

    # Strict OTP validation — always verify exact match
    if not stored:
        raise HTTPException(status_code=400, detail="OTP has expired or was not requested. Please request a new OTP.")
    if stored != body.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP code. Please enter the correct 6-digit code.")

    await delete_otp(body.phone)

    # Find or create user
    result = await db.execute(select(User).where(User.phone == body.phone))
    user = result.scalar_one_or_none()

    if body.flow == "login":
        if not user:
            raise HTTPException(status_code=404, detail="Account not found. Please register first.")
        if user.role.value != body.role:
            raise HTTPException(status_code=403, detail=f"Account role mismatch: registered as {user.role.value}.")
    else:
        # Register flow
        if not user:
            role = UserRole(body.role) if body.role in UserRole._value2member_map_ else UserRole.customer
            user = User(phone=body.phone, name=f"User_{body.phone[-4:]}", role=role)
            db.add(user)
            await db.flush()
            await db.refresh(user)

    access  = create_access_token(user.id, user.role.value)
    refresh = create_refresh_token(user.id)

    return TokenResponse(
        access_token=access,
        refresh_token=refresh,
        user_id=user.id,
        role=user.role.value,
        name=user.name,
    )


# ── Admin Login (username + password) ─────────────────────────────────────────
@router.post("/admin-login", response_model=TokenResponse, summary="Admin sign-in")
async def admin_login(body: AdminLoginRequest, db: AsyncSession = Depends(get_db)):
    if body.username != settings.ADMIN_DEFAULT_ID or body.password != settings.ADMIN_DEFAULT_PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid admin credentials.")

    result = await db.execute(
        select(User).where(User.phone == "0000000000", User.role == UserRole.admin)
    )
    admin = result.scalar_one_or_none()
    if not admin:
        admin = User(
            phone="0000000000",
            name="LabouRack Admin",
            role=UserRole.admin,
            email="admin@labourack.in",
        )
        db.add(admin)
        await db.flush()
        await db.refresh(admin)

    access  = create_access_token(admin.id, UserRole.admin.value)
    refresh = create_refresh_token(admin.id)
    return TokenResponse(
        access_token=access, refresh_token=refresh,
        user_id=admin.id, role="admin", name=admin.name,
    )


# ── Refresh Token ─────────────────────────────────────────────────────────────
@router.post("/refresh", response_model=TokenResponse, summary="Refresh access token")
async def refresh_token(body: RefreshRequest, db: AsyncSession = Depends(get_db)):
    payload = decode_token(body.refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid refresh token.")

    result = await db.execute(select(User).where(User.id == payload["sub"]))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    access  = create_access_token(user.id, user.role.value)
    refresh = create_refresh_token(user.id)
    return TokenResponse(
        access_token=access, refresh_token=refresh,
        user_id=user.id, role=user.role.value, name=user.name,
    )
