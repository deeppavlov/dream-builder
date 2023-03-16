from typing import Optional

from pydantic import BaseModel, BaseSettings

URL_TOKENINFO = "https://www.googleapis.com/oauth2/v3/tokeninfo?access_token="
CLIENT_SECRET_FILENAME = "client_secret.json"


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
    dream_root_path: Optional[str]


class AuthSettings(BaseModel):
    google_client_id: str
    test_token: str
    google_client_secret: str
    refresh_token_lifetime_days: int
    redirect_uri: str


class SmtpSettings(BaseModel):
    server: str
    port: int
    user: str
    password: str


class Settings(BaseSettings):
    url: UrlSettings
    db: DatabaseSettings
    auth: AuthSettings
    smtp: SmtpSettings

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        env_nested_delimiter = "__"

    @property
    def auth_client_info(self):
        return {
            "client_id": self.auth.google_client_id,
            "client_secret": self.auth.google_client_secret,
        }


settings = Settings()
