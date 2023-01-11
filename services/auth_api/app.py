from fastapi import FastAPI

from services.auth_api.auth import router

app = FastAPI()


app.include_router(router)
