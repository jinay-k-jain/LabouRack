"""FastAPI dependency injection — DB session, current user, role guards."""

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import AsyncSessionLocal
from app.core.security import decode_token
from app.models.user import User, UserRole

# ── DB Session ────────────────────────────────────────────────────────────────
async def get_db() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


# ── JWT Bearer ────────────────────────────────────────────────────────────────
bearer_scheme = HTTPBearer()

_UNAUTHORIZED = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Invalid or expired token",
    headers={"WWW-Authenticate": "Bearer"},
)


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: AsyncSession = Depends(get_db),
) -> User:
    payload = decode_token(credentials.credentials)
    if not payload or payload.get("type") != "access":
        raise _UNAUTHORIZED

    user_id: str = payload.get("sub")
    if not user_id:
        raise _UNAUTHORIZED

    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user or not user.is_active:
        raise _UNAUTHORIZED
    return user


# ── Role guards ───────────────────────────────────────────────────────────────
def require_role(*roles: UserRole):
    """Factory that returns a dependency requiring one of the given roles."""
    async def _guard(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Required role(s): {[r.value for r in roles]}",
            )
        return current_user
    return _guard


# ── Convenience shorthands ────────────────────────────────────────────────────
require_customer = require_role(UserRole.customer)
require_worker   = require_role(UserRole.worker)
require_admin    = require_role(UserRole.admin)
require_any      = require_role(UserRole.customer, UserRole.worker, UserRole.admin)
