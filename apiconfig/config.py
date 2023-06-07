import secrets
from pathlib import Path
from typing import Optional

from pydantic import BaseModel, BaseSettings, Field

URL_TOKENINFO = "https://www.googleapis.com/oauth2/v3/tokeninfo?access_token="
CLIENT_SECRET_FILENAME = "client_secret.json"

GITHUB_AUTH_URL = "https://github.com/login/oauth/authorize"
GITHUB_TOKENINFO = "https://github.com/login/oauth/access_token?"
GITHUB_URL_USERINFO = "https://api.github.com/user"


def _default_agent_user_id_prefix():
    return secrets.token_urlsafe(8)


class AppSettings(BaseModel):
    default_openai_api_key: str
    add_cors_middleware: Optional[bool] = False
    agent_user_id_prefix: Optional[str] = Field(default_factory=_default_agent_user_id_prefix)


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
    initial_data_dir: Path
    dream_root_path: Optional[Path]


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


class DeployerSettings(BaseModel):
    registry_url: str
    portainer_url: str
    portainer_key: str
    default_prefix: str


class GithubAuth(BaseModel):
    client_id: str
    client_secret: str


class Settings(BaseSettings):
    app: AppSettings
    url: UrlSettings
    db: DatabaseSettings
    auth: AuthSettings
    smtp: SmtpSettings
    deployer: DeployerSettings
    github: GithubAuth

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

    @property
    def github_auth_client_info(self):
        return {"client_id": self.github.client_id, "client_secret": self.github.client_secret}


settings = Settings()
