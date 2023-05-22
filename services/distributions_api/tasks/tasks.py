import logging
import os
from celery import Celery

import services.distributions_api.routes.deployments as deployments

logger = logging.getLogger()

CELERY_BROKER_URL = os.environ.get("CELERY_BROKER_URL", "redis://redis:6379/0")
CELERY_RESULT_BACKEND = os.environ.get("CELERY_RESULT_BACKEND", "redis://redis:6379/0")

app = Celery("deploy_tasks", broker=CELERY_BROKER_URL, backend=CELERY_RESULT_BACKEND)


@app.task(ignore_result=True)
def run_deployer_task(*args, **kwargs):
    return deployments.run_deployer(*args, **kwargs)
