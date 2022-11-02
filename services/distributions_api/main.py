from fastapi import FastAPI

from routes.distribution import router as distribution_router
from routes.configs import router as configs_router

app = FastAPI()


app.include_router(distribution_router)
app.include_router(configs_router)
