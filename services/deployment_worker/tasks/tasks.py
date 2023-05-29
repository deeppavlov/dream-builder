import logging
import os
from celery import Celery
from celery.result import AsyncResult

import services.distributions_api.routes.deployments as deployments

logger = logging.getLogger()

CELERY_BROKER_URL = os.environ.get("CELERY_BROKER_URL", "redis://redis:6379/0")
CELERY_RESULT_BACKEND = os.environ.get("CELERY_RESULT_BACKEND", "redis://redis:6379/0")

app = Celery("deploy_tasks", broker=CELERY_BROKER_URL, backend=CELERY_RESULT_BACKEND)


@app.task(bind=True, track_started=True)
def run_deployer_task(*args, **kwargs):
    return deployments.run_deployer(*args, **kwargs)


def get_task_status(task_id: str):
    result = AsyncResult(task_id)
    if result.status == "PENDING":
        task_status = "Task state is unknown"
    return {
        "status": task_status,
        "result": result.result,
        "is_ready": result.ready(),
        "state": result.state,
        "task_info": result.info,
    }
