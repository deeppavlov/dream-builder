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
public_va_name = "Marketing Assistant"
skill_name = "Marketing Skill"

public_template_list = [" AI FAQ Assistant"
                        "fairytale_assistant",
                        "fashion_stylist_assistant",
                        "life_coaching_assistant",
                        "marketing_assistant",
                        "nutrition_assistant",
                        "multiskill_ai_assistant"]
