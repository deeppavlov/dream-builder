from pydantic import BaseSettings

from pathlib import Path


class Settings(BaseSettings):
    google_client_id: str
    db_user: str
    db_password: str
    db_host: str
    db_port: int
    db_name: str
    test_token: str

    class Config:
        env_file = Path(__file__).with_name(".env").absolute()
        env_file_encoding = "utf-8"


settings = Settings()
