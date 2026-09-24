from pydantic_settings import BaseSettings
from pydantic import AnyHttpUrl, field_validator
from typing import List
import os


class Settings(BaseSettings):
    # ── App ──────────────────────────────────────────────────────────────────
    APP_NAME: str = "LabouRack API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    ENVIRONMENT: str = "development"

    # ── Server ────────────────────────────────────────────────────────────────
    HOST: str = "127.0.0.1"
    PORT: int = 8000

    # ── Database ──────────────────────────────────────────────────────────────
    DATABASE_URL: str = "sqlite+aiosqlite:///./labourack.db"

    # ── JWT ───────────────────────────────────────────────────────────────────
    SECRET_KEY: str = "dev-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # ── Redis ─────────────────────────────────────────────────────────────────
    REDIS_URL: str = "redis://localhost:6379/0"
    OTP_TTL_SECONDS: int = 600  # 10 minutes

    # ── Celery ────────────────────────────────────────────────────────────────
    CELERY_BROKER_URL: str = "redis://localhost:6379/1"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/2"

    @field_validator("REDIS_URL", "CELERY_BROKER_URL", "CELERY_RESULT_BACKEND", mode="before")
    @classmethod
    def clean_redis_url(cls, v: str) -> str:
        if not isinstance(v, str):
            return v
        v = v.strip().strip("'\"")
        # Strip CLI wrappers like: redis-cli --tls -u redis://...
        if "redis://" in v and not v.startswith("redis://"):
            v = v[v.index("redis://"):]
        elif "rediss://" in v and not v.startswith("rediss://"):
            v = v[v.index("rediss://"):]
        # If Upstash and using redis://, convert to rediss:// for TLS
        if "upstash.io" in v and v.startswith("redis://"):
            v = "rediss://" + v[8:]
        # Ensure ssl_cert_reqs is present if rediss:// URL is used with Celery
        return v

    # ── CORS ──────────────────────────────────────────────────────────────────
    ALLOWED_ORIGINS: str = "http://localhost:5173,http://localhost:3000"

    @property
    def cors_origins(self) -> List[str]:
        return [o.strip() for o in self.ALLOWED_ORIGINS.split(",")]

    # ── SMS / OTP ─────────────────────────────────────────────────────────────
    SMS_PROVIDER: str = "mock"  # mock | twilio | msg91
    TWILIO_ACCOUNT_SID: str = ""
    TWILIO_AUTH_TOKEN: str = ""
    TWILIO_PHONE_NUMBER: str = ""

    # ── Admin ─────────────────────────────────────────────────────────────────
    ADMIN_DEFAULT_ID: str = "admin"
    ADMIN_DEFAULT_PASSWORD: str = "admin123"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True


# Singleton — import this everywhere
settings = Settings()
