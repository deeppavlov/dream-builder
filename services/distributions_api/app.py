from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from apiconfig.config import settings
from services.distributions_api.routes.admin.router import admin_router
from services.distributions_api.routes.api_keys.router import tokens_router
from services.distributions_api.routes.assistant_dists.router import assistant_dists_router
from services.distributions_api.routes.components.router import components_router
from services.distributions_api.routes.deployments.router import deployments_router
from services.distributions_api.routes.dialog_sessions.router import dialog_sessions_router
from services.distributions_api.routes.users.router import users_router
from services.distributions_api.routes.lm_services.router import lm_services_router

app = FastAPI()


if settings.app.add_cors_middleware:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


app.include_router(assistant_dists_router)
app.include_router(components_router)
app.include_router(users_router)
app.include_router(tokens_router)
app.include_router(dialog_sessions_router)
app.include_router(deployments_router)
app.include_router(admin_router)
app.include_router(lm_services_router)
