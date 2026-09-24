"""Celery tasks — OTP dispatch, push notifications."""

import logging
from app.tasks.celery_app import celery_app
from app.config import settings

logger = logging.getLogger(__name__)


@celery_app.task(bind=True, max_retries=3, name="app.tasks.notifications.send_otp_sms")
def send_otp_sms(self, phone: str, otp: str):
    """Send OTP via SMS (mock in dev, real provider in prod)."""
    try:
        if settings.SMS_PROVIDER == "mock":
            # In development: log to console
            logger.info(f"[MOCK SMS] OTP for +91{phone}: {otp}")
            print(f"\n📱 OTP for +91{phone} → {otp}\n")
            return {"status": "sent", "provider": "mock"}

        elif settings.SMS_PROVIDER == "twilio":
            from twilio.rest import Client
            client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
            message = client.messages.create(
                body=f"Your LabouRack OTP is {otp}. Valid for 10 minutes. Do not share.",
                from_=settings.TWILIO_PHONE_NUMBER,
                to=f"+91{phone}",
            )
            logger.info(f"[TWILIO] OTP sent to {phone}. SID: {message.sid}")
            return {"status": "sent", "provider": "twilio", "sid": message.sid}

    except Exception as exc:
        logger.error(f"OTP send failed for {phone}: {exc}")
        raise self.retry(exc=exc, countdown=5)


@celery_app.task(name="app.tasks.notifications.send_booking_confirmation")
def send_booking_confirmation(phone: str, booking_id: str, worker_name: str, eta: int):
    """Notify customer that a worker has been assigned."""
    logger.info(
        f"[MOCK NOTIFY] Booking {booking_id}: Worker '{worker_name}' assigned. "
        f"ETA {eta} mins → customer +91{phone}"
    )
    return {"status": "sent"}


@celery_app.task(name="app.tasks.notifications.send_worker_job_alert")
def send_worker_job_alert(worker_phone: str, job_id: str, issue: str, distance_km: float):
    """Push a new job alert to a worker."""
    logger.info(
        f"[MOCK NOTIFY] New job {job_id} '{issue}' ({distance_km} km) "
        f"→ worker +91{worker_phone}"
    )
    return {"status": "sent"}


@celery_app.task(name="app.tasks.notifications.cleanup_expired_otps")
def cleanup_expired_otps():
    """Periodic: Redis handles TTL natively, this is a no-op placeholder."""
    logger.info("[BEAT] OTP cleanup tick (Redis TTL handles expiry automatically)")
    return {"status": "ok"}
