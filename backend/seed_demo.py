"""Seed the local development database with Dhanbad demo accounts."""

import asyncio

from app.database import AsyncSessionLocal, init_db
from app.seed_data import DHANBAD_WORKERS, seed_demo_data


async def seed():
    await init_db()
    async with AsyncSessionLocal() as session:
        await seed_demo_data(session)
        await session.commit()
    print("DHANBAD_DEMO_ACCOUNTS_READY")
    print("Customer: Rahul Sharma | 9876543210")
    for name, phone, categories, *_ in DHANBAD_WORKERS:
        print(f"Worker: {name} | {phone} | {', '.join(categories)}")
    print("Use the existing OTP login flow; in development the OTP is returned by /auth/send-otp.")


if __name__ == "__main__":
    asyncio.run(seed())
