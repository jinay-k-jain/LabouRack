import pytest
import time
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
        # Send OTP for seeded Dhanbad plumbing worker (Aman Kumar)
        res = await client.post("/auth/send-otp", json={"phone": "9001000001", "role": "worker", "flow": "login"})
        assert res.status_code == 200
        otp = res.json()["otp"]

        # Verify correct OTP
        verify_res = await client.post(
            "/auth/verify-otp",
            json={"phone": "9001000001", "otp": otp, "role": "worker", "flow": "login"},
        )
        assert verify_res.status_code == 200
        tokens = verify_res.json()
        assert "access_token" in tokens
        assert tokens["role"] == "worker"


async def login(client: AsyncClient, phone: str, role: str) -> str:
    sent = await client.post("/auth/send-otp", json={"phone": phone, "role": role, "flow": "login"})
    assert sent.status_code == 200
    verified = await client.post(
        "/auth/verify-otp",
        json={"phone": phone, "otp": sent.json()["otp"], "role": role, "flow": "login"},
    )
    assert verified.status_code == 200
    return verified.json()["access_token"]


@pytest.mark.asyncio
async def test_booking_estimate_decision_reaches_assigned_worker():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        customer_token = await login(client, "9876543210", "customer")
        available = await client.get("/workers/available", params={"category": "plumbing"})
        assert available.status_code == 200
        aman = next(worker for worker in available.json() if worker["name"] == "Aman Kumar")

        created = await client.post(
            "/bookings/",
            headers={"Authorization": f"Bearer {customer_token}"},
            json={
                "issue": "Leaking tap",
                "description": "Kitchen tap is leaking continuously.",
                "category": "plumbing",
                "address": "Bank More, Dhanbad",
                "locality": "Bank More",
                "selected_worker_id": aman["id"],
            },
        )
        assert created.status_code == 201
        booking_id = created.json()["booking_id"]
        job_id = created.json()["job_id"]

        worker_token = await login(client, "9001000001", "worker")
        jobs = await client.get("/workers/me/jobs", headers={"Authorization": f"Bearer {worker_token}"})
        assert any(job["id"] == job_id for job in jobs.json())

        estimate = await client.post(
            f"/workers/me/jobs/{job_id}/estimate",
            headers={"Authorization": f"Bearer {worker_token}"},
            json={"job_id": job_id, "labour_charge": 400, "materials_cost": 100, "visiting_fee": 69},
        )
        assert estimate.status_code == 200

        decision = await client.post(
            f"/bookings/{booking_id}/estimate-decision",
            headers={"Authorization": f"Bearer {customer_token}"},
            json={"decision": "counter_offer", "counter_offer": 500, "feedback": "Please keep the total within Rs 500."},
        )
        assert decision.status_code == 200

        updated_jobs = await client.get("/workers/me/jobs", headers={"Authorization": f"Bearer {worker_token}"})
        job = next(item for item in updated_jobs.json() if item["id"] == job_id)
        assert job["customer_decision"] == "counter_offer"
        assert job["customer_counter_offer"] == 500
        assert job["customer_feedback"] == "Please keep the total within Rs 500."


@pytest.mark.asyncio
async def test_express_cleaning_booking_assigns_priya_kumari():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        customer_token = await login(client, "9876543210", "customer")
        created = await client.post(
            "/bookings/",
            headers={"Authorization": f"Bearer {customer_token}"},
            json={
                "issue": "Kitchen deep cleaning",
                "description": "Need a full kitchen clean.",
                "category": "cleaning",
                "address": "Bank More, Dhanbad",
                "locality": "Bank More",
                "express": True,
            },
        )
        assert created.status_code == 201
        assert created.json()["assignment_type"] == "express"
        assert created.json()["assigned_worker"]["name"] == "Priya Kumari"

        priya_token = await login(client, "9001000005", "worker")
        jobs = await client.get("/workers/me/jobs", headers={"Authorization": f"Bearer {priya_token}"})
        assert any(job["id"] == created.json()["job_id"] for job in jobs.json())


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
        phone = f"97777{time.time_ns() % 100000:05d}"
        # Register new phone with flow="register"
        res = await client.post("/auth/send-otp", json={"phone": phone, "role": "customer", "flow": "register"})
        assert res.status_code == 200
        otp = res.json()["otp"]

        # Verify registration OTP
        verify_res = await client.post(
            "/auth/verify-otp",
            json={"phone": phone, "otp": otp, "role": "customer", "flow": "register"},
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
