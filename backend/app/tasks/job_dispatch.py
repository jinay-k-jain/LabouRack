"""Celery tasks — job matching, dispatch, stale-job cleanup."""

import logging
from datetime import datetime, timedelta, timezone
from app.tasks.celery_app import celery_app

logger = logging.getLogger(__name__)


@celery_app.task(name="app.tasks.job_dispatch.dispatch_job_to_nearby_workers")
def dispatch_job_to_nearby_workers(booking_id: str, category: str, locality: str):
    """
    Find online workers near the booking locality and send each a job alert.

    In production this would:
    1. Query Redis for online workers
    2. Filter by category and geo-distance
    3. Broadcast via WebSocket + SMS (send_worker_job_alert)
    """
    logger.info(
        f"[DISPATCH] Booking {booking_id} → category={category}, locality={locality}"
    )
    # TODO: integrate geo-filter with real worker coordinates
    from app.tasks.notifications import send_worker_job_alert
    # Demo: simulate dispatch to 3 mock workers
    for i in range(1, 4):
        send_worker_job_alert.delay(
            worker_phone=f"99999999{i:02d}",
            job_id=f"{booking_id}-w{i}",
            issue=category,
            distance_km=round(i * 0.8, 1),
        )
    return {"status": "dispatched", "workers_notified": 3}


@celery_app.task(name="app.tasks.job_dispatch.auto_assign_worker")
def auto_assign_worker(booking_id: str):
    """
    Express-book flow: automatically assign the nearest available verified worker.
    Falls back to broadcast if no auto-match found within 60 s.
    """
    logger.info(f"[AUTO-ASSIGN] Attempting auto-assign for booking {booking_id}")
    # TODO: real geo-query + worker selection logic
    return {"status": "auto_assigned", "booking_id": booking_id}


@celery_app.task(name="app.tasks.job_dispatch.mark_stale_jobs")
def mark_stale_jobs():
    """
    Periodic: cancel job requests that have been pending for > 30 minutes
    with no worker acceptance.
    """
    cutoff = datetime.now(timezone.utc) - timedelta(minutes=30)
    logger.info(f"[BEAT] Marking stale jobs dispatched before {cutoff.isoformat()}")
    # TODO: DB query to find and cancel stale JobRequest rows
    return {"status": "ok"}
