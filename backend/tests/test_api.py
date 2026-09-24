import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.database import init_db


@pytest.fixture(autouse=True)
async def setup_db():
    await init_db()


@pytest.mark.asyncio
async def test_health_check():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "ok"
        assert "database" in data


@pytest.mark.asyncio
async def test_root():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "running"
        assert data["app"] == "LabouRack API"


@pytest.mark.asyncio
async def test_send_and_verify_otp():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # 1. Send OTP
        res = await client.post("/auth/send-otp", json={"phone": "9876543210", "role": "worker"})
        assert res.status_code == 200
        data = res.json()
        assert "message" in data
        otp = data.get("otp")
        assert otp is not None

        # 2. Verify OTP
        verify_res = await client.post(
            "/auth/verify-otp",
            json={"phone": "9876543210", "otp": otp, "role": "worker"},
        )
        assert verify_res.status_code == 200
        token_data = verify_res.json()
        assert "access_token" in token_data
        assert token_data["token_type"] == "bearer"
