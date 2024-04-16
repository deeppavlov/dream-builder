from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from apiconfig.config import settings
from services.feedback_api.feedback import router


app = FastAPI()

if settings.app.add_cors_middleware:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(router)
