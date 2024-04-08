from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from apiconfig.config import settings
from git_storage.git_manager import GitManager
from services.distributions_api.routes.admin.router import admin_router
from services.distributions_api.routes.api_keys.router import api_keys_router
from services.distributions_api.routes.assistant_dists.router import assistant_dists_router
from services.distributions_api.routes.components.router import components_router
from services.distributions_api.routes.deployments.router import deployments_router
from services.distributions_api.routes.dialog_sessions.router import dialog_sessions_router
from services.distributions_api.routes.users.router import users_router
from services.distributions_api.routes.lm_services.router import lm_services_router
from services.distributions_api.routes.tokens.router import tokens_router


app = FastAPI()


dream_git = GitManager(
    settings.git.local_path,
    settings.git.username,
    settings.git.remote_access_token,
    settings.git.remote_source_url,
    settings.git.remote_source_branch,
    settings.git.remote_copy_url,
    # settings.git.remote_copy_branch,
    f"{settings.git.remote_copy_branch}-{settings.app.agent_user_id_prefix}",
)


if settings.app.add_cors_middleware:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


def migrate_on_startup():
    dream_git.pull_copy_remote_origin()


app.add_event_handler("startup", migrate_on_startup)
app.include_router(assistant_dists_router)
app.include_router(components_router)
app.include_router(users_router)
app.include_router(api_keys_router)
app.include_router(dialog_sessions_router)
app.include_router(deployments_router)
app.include_router(admin_router)
app.include_router(lm_services_router)
app.include_router(tokens_router)
