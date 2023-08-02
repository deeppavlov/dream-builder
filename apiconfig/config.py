import secrets
from pathlib import Path
from typing import Optional, Literal

from pydantic import BaseModel, BaseSettings, Field

URL_TOKENINFO = "https://www.googleapis.com/oauth2/v3/tokeninfo?access_token="
CLIENT_SECRET_FILENAME = "client_secret.json"

AVAILABLE_CLOUD_SERVICES = Literal["amazon", "local"]


def _default_agent_user_id_prefix():
    return secrets.token_urlsafe(8)


class AppSettings(BaseModel):
    default_openai_api_key: str
    agent_user_id_prefix: str
    add_cors_middleware: Optional[bool] = False


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
    cloud_service: Optional[AVAILABLE_CLOUD_SERVICES]


# class StorageSettings(BaseModel):
#     region_name: str
#     aws_access_key_id: str
#     aws_secret_access_key: str


class GitSettings(BaseModel):
    local_path: Path
    username: str
    remote_access_token: str
    remote_source_url: str
    remote_source_branch: str
    remote_copy_url: str
    remote_copy_branch: str


class CelerySettings(BaseModel):
    broker: str
    backend: str


class RedisSettings(BaseModel):
    host: str
    port: int


class Settings(BaseSettings):
    app: AppSettings
    url: UrlSettings
    db: DatabaseSettings
    auth: AuthSettings
    smtp: SmtpSettings
    deployer: DeployerSettings
    # storage: StorageSettings
    git: GitSettings
    celery: CelerySettings
    redis: RedisSettings

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
