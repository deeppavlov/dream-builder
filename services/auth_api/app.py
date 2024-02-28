import logging
import os

from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from logging_loki import LokiQueueHandler
from multiprocessing import Queue

from apiconfig.config import settings
from services.auth_api.auth import router


app = FastAPI()

loki_logs_handler = LokiQueueHandler(
    Queue(-1),
    url=os.getenv("LOKI_URL"),
    tags={"application": f"auth-api-{os.getenv('SERVICE_PREFIX')}"},
    version="1",
)

uvicorn_access_logger = logging.getLogger("uvicorn.access")
uvicorn_error_logger = logging.getLogger("uvicorn.error")

uvicorn_access_logger.addHandler(loki_logs_handler)
uvicorn_error_logger.addHandler(loki_logs_handler)

if settings.app.add_cors_middleware:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(router)
