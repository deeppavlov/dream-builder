from fastapi import FastAPI

from services.distributions_api.routes.distribution import router as distribution_router
from services.distributions_api.routes.configs import router as configs_router

app = FastAPI()


app.include_router(distribution_router)
app.include_router(configs_router)