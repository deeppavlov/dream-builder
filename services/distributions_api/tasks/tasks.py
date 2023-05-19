import random
import time

from celery import Celery
import logging

logger = logging.getLogger()

app = Celery("deploy_tasks", broker="redis://redis:6379/0")


# FOR TEST PURPOSES ONLY
@app.task(ignore_result=True)
def heavy_func():
    logging.info("hello, i haven't slept for a while")
    time.sleep(10)
    logging.info("hello, i slept 10sec")
    return {"hello": "the worker's planet"}
