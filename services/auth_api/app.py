from fastapi import FastAPI
from starlette.middleware.sessions import SessionMiddleware


from auth import router
from config import config
app = FastAPI()
app.include_router(router)
app.add_middleware(SessionMiddleware, secret_key=config["security"]["GOOGLE_CLIENT_SECRET"])
