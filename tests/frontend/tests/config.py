from pydantic import BaseModel, BaseSettings
from pathlib import Path


class UrlSettings(BaseModel):
    frontend: str
    email: str


class Settings(BaseSettings):
    url: UrlSettings

    class Config:
        env_file = (Path(__file__).parents[0] / ".env").absolute()
        env_file_encoding = "utf-8"
        env_nested_delimiter = "__"


settings_test = Settings()

url = settings_test.url.frontend
users_email = settings_test.url.email

generative_model = "ChatGPT"
public_va_name = "nutrition_assistant"
skill_name = "Nutrition Skill"

