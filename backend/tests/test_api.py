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
async def test_demo_customer_login():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # 1. Send OTP for seeded customer (9876543210)
        res = await client.post("/auth/send-otp", json={"phone": "9876543210", "role": "customer", "flow": "login"})
        assert res.status_code == 200
        otp = res.json()["otp"]
        assert otp is not None

        # 2. Try with WRONG OTP -> must fail with 400
        bad_res = await client.post(
            "/auth/verify-otp",
            json={"phone": "9876543210", "otp": "000000", "role": "customer", "flow": "login"},
        )
        assert bad_res.status_code == 400
        assert "Invalid OTP" in bad_res.json()["detail"]

        # 3. Try with CORRECT OTP -> must succeed with 200
        good_res = await client.post(
            "/auth/verify-otp",
            json={"phone": "9876543210", "otp": otp, "role": "customer", "flow": "login"},
        )
        assert good_res.status_code == 200
        tokens = good_res.json()
        assert "access_token" in tokens
        assert tokens["role"] == "customer"


@pytest.mark.asyncio
async def test_demo_worker_login():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # Send OTP for seeded worker (9812345678)
        res = await client.post("/auth/send-otp", json={"phone": "9812345678", "role": "worker", "flow": "login"})
        assert res.status_code == 200
        otp = res.json()["otp"]

        # Verify correct OTP
        verify_res = await client.post(
            "/auth/verify-otp",
            json={"phone": "9812345678", "otp": otp, "role": "worker", "flow": "login"},
        )
        assert verify_res.status_code == 200
        tokens = verify_res.json()
        assert "access_token" in tokens
        assert tokens["role"] == "worker"


@pytest.mark.asyncio
async def test_unregistered_number_login_rejected():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # Login with an uncreated number must return 404
        res = await client.post("/auth/send-otp", json={"phone": "9999988888", "role": "worker", "flow": "login"})
        assert res.status_code == 404
        assert "No registered" in res.json()["detail"]


@pytest.mark.asyncio
async def test_new_user_registration_flow():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # Register new phone with flow="register"
        res = await client.post("/auth/send-otp", json={"phone": "9777766666", "role": "customer", "flow": "register"})
        assert res.status_code == 200
        otp = res.json()["otp"]

        # Verify registration OTP
        verify_res = await client.post(
            "/auth/verify-otp",
            json={"phone": "9777766666", "otp": otp, "role": "customer", "flow": "register"},
        )
        assert verify_res.status_code == 200
        tokens = verify_res.json()
        assert "access_token" in tokens


@pytest.mark.asyncio
async def test_admin_login():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        res = await client.post("/auth/admin-login", json={"username": "admin", "password": "admin123"})
        assert res.status_code == 200
        tokens = res.json()
        assert "access_token" in tokens
        assert tokens["role"] == "admin"
