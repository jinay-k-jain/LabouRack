"""Celery application — configured with Redis broker."""

from celery import Celery
from app.config import settings

celery_app = Celery(
    "labourack",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND,
    include=[
        "app.tasks.notifications",
        "app.tasks.job_dispatch",
    ],
)

celery_app.conf.update(
    # Serialization
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="Asia/Kolkata",
    enable_utc=True,

    # Retry defaults
    task_acks_late=True,
    task_reject_on_worker_lost=True,
    task_max_retries=3,

    # Beat schedule (periodic tasks)
    beat_schedule={
        "cleanup-expired-otps": {
            "task": "app.tasks.notifications.cleanup_expired_otps",
            "schedule": 300.0,  # every 5 minutes
        },
        "mark-stale-jobs": {
            "task": "app.tasks.job_dispatch.mark_stale_jobs",
            "schedule": 60.0,   # every 60 seconds
        },
    },
)
