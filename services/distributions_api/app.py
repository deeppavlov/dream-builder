from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from services.distributions_api.routes.annotators import annotators_router
from services.distributions_api.routes.api_tokens import tokens_router
from services.distributions_api.routes.assistant_dists import assistant_dists_router
from services.distributions_api.routes.configs import configs_router
from services.distributions_api.routes.deployments import deployments_router
from services.distributions_api.routes.skills import skills_router
from services.distributions_api.routes.users import users_router
from services.distributions_api.routes.dialog_sessions import dialog_sessions_router

app = FastAPI()


# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

app.include_router(annotators_router)
app.include_router(assistant_dists_router)
app.include_router(configs_router)
app.include_router(skills_router)
app.include_router(users_router)
app.include_router(tokens_router)
app.include_router(dialog_sessions_router)
app.include_router(deployments_router)
