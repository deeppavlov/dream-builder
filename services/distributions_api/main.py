from fastapi import Depends, FastAPI

from routes.configs import router as configs_router
from routes.distribution import router as distribution_router
from security.auth import verify_token

app = FastAPI(dependencies=[Depends(verify_token)])


app.include_router(distribution_router)
app.include_router(configs_router)
