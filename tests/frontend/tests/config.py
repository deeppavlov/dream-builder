from pydantic import BaseModel, BaseSettings
from pathlib import Path
from random_word import RandomWords


class UrlSettings(BaseModel):
    frontend: str
    email: str
    token: str
    github_email: str
    github_password: str


class Settings(BaseSettings):
    url: UrlSettings


    class Config:
        env_file = (Path(__file__).parents[0] / ".env").absolute()
        env_file_encoding = "utf-8"
        env_nested_delimiter = "__"


settings_test = Settings()

url = settings_test.url.frontend
admin_url = url+"admin"
users_email = settings_test.url.email
openai_token = settings_test.url.token
github_email = settings_test.url.github_email
github_password = settings_test.url.github_password

generative_model = "ChatGPT"
public_va_name = "Marketing Assistant"
your_va_name = RandomWords().get_random_word()
skill_name = "Marketing Skill"

public_template_list = ["ai_faq_assistant"
                        "fairytale_assistant",
                        "fashion_stylist_assistant",
                        "life_coaching_assistant",
                        "marketing_assistant",
                        "nutrition_assistant",
                        "multiskill_ai_assistant"]
