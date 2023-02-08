from pydantic import BaseModel, BaseSettings


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
    google_client_secret: str
    refresh_token_lifetime_days: int
    redirect_uri: str


class Settings(BaseSettings):
    url: UrlSettings
    db: DatabaseSettings
    auth: AuthSettings

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        env_nested_delimiter = "__"


settings = Settings()
