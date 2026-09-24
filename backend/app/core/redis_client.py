"""Redis client — connection pool + OTP helpers."""

import json
import redis.asyncio as aioredis
from typing import Any, Optional

from app.config import settings

# ── Connection pool (created once, reused) ────────────────────────────────────
_redis_pool: Optional[aioredis.Redis] = None


async def get_redis() -> aioredis.Redis:
    global _redis_pool
    if _redis_pool is None:
        _redis_pool = aioredis.from_url(
            settings.REDIS_URL,
            encoding="utf-8",
            decode_responses=True,
        )
    return _redis_pool


async def close_redis() -> None:
    global _redis_pool
    if _redis_pool:
        await _redis_pool.aclose()
        _redis_pool = None


# ── OTP helpers ───────────────────────────────────────────────────────────────
OTP_PREFIX = "otp:"
WS_PREFIX = "ws:connections:"


# In-memory fallback for local dev when Redis is not running
_memory_cache: dict[str, str] = {}
_memory_sets: dict[str, set] = {}


async def store_otp(phone: str, otp: str) -> None:
    """Store OTP in Redis with TTL (and sync to in-memory backup)."""
    _memory_cache[f"{OTP_PREFIX}{phone}"] = otp
    try:
        r = await get_redis()
        await r.setex(f"{OTP_PREFIX}{phone}", settings.OTP_TTL_SECONDS, otp)
    except Exception:
        pass


async def get_otp(phone: str) -> Optional[str]:
    """Retrieve OTP from Redis (falls back to memory backup)."""
    try:
        r = await get_redis()
        val = await r.get(f"{OTP_PREFIX}{phone}")
        if val:
            return val
    except Exception:
        pass
    return _memory_cache.get(f"{OTP_PREFIX}{phone}")


async def delete_otp(phone: str) -> None:
    """Delete OTP after successful verification."""
    _memory_cache.pop(f"{OTP_PREFIX}{phone}", None)
    try:
        r = await get_redis()
        await r.delete(f"{OTP_PREFIX}{phone}")
    except Exception:
        pass


# ── Generic cache helpers ─────────────────────────────────────────────────────
async def cache_set(key: str, value: Any, ttl: int = 300) -> None:
    try:
        r = await get_redis()
        await r.setex(key, ttl, json.dumps(value))
    except Exception:
        _memory_cache[key] = json.dumps(value)


async def cache_get(key: str) -> Optional[Any]:
    try:
        r = await get_redis()
        raw = await r.get(key)
    except Exception:
        raw = _memory_cache.get(key)
    return json.loads(raw) if raw else None


async def cache_delete(key: str) -> None:
    try:
        r = await get_redis()
        await r.delete(key)
    except Exception:
        _memory_cache.pop(key, None)


# ── Online worker set ─────────────────────────────────────────────────────────
async def set_worker_online(worker_id: str) -> None:
    try:
        r = await get_redis()
        await r.sadd("workers:online", worker_id)
    except Exception:
        _memory_sets.setdefault("workers:online", set()).add(worker_id)


async def set_worker_offline(worker_id: str) -> None:
    try:
        r = await get_redis()
        await r.srem("workers:online", worker_id)
    except Exception:
        if "workers:online" in _memory_sets:
            _memory_sets["workers:online"].discard(worker_id)


async def get_online_workers() -> set:
    try:
        r = await get_redis()
        return await r.smembers("workers:online")
    except Exception:
        return _memory_sets.get("workers:online", set())
