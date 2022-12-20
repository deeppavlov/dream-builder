from pydantic import BaseModel, BaseSettings
from pathlib import Path

class UrlSettings(BaseModel):
    frontend: str
    auth_api: str
    distributions_api: str


class DatabaseSettings(BaseModel):
    user: str
    password: str
    host: str
    port: int
    name: str


class AuthSettings(BaseModel):
    google_client_id: str
    test_token: str


class Settings(BaseSettings):
    url: UrlSettings
    db: DatabaseSettings
    auth: AuthSettings

    class Config:
        env_file = (Path(__file__).parents[2] / ".env").absolute()
        env_file_encoding = "utf-8"
        env_nested_delimiter = "__"


settings = Settings()

header = {"jwt-data": settings.auth.test_token, 'accept': 'application/json'}
token_endpoint = f"{settings.url.auth_api}/auth/token"
assistant_dists_endpoint = f"{settings.url.distributions_api}/api/assistant_dists"
