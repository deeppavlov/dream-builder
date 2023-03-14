from fastapi import FastAPI

from services.distributions_api.routes.annotators import annotators_router
from services.distributions_api.routes.assistant_dists import assistant_dists_router
from services.distributions_api.routes.configs import configs_router
from services.distributions_api.routes.skills import skills_router

app = FastAPI()


app.include_router(annotators_router)
app.include_router(assistant_dists_router)
app.include_router(configs_router)
app.include_router(skills_router)
