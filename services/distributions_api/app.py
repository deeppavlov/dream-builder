from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from services.distributions_api.routes.configs import router as configs_router
from services.distributions_api.routes.distribution import router as distribution_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(distribution_router)
app.include_router(configs_router)
