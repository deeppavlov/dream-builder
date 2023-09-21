from pydantic import BaseModel, BaseSettings
from pathlib import Path
from random_word import RandomWords


class TestSettings(BaseModel):
    url_frontend: str
    email: str
    openai_token: str
    github_email: str
    github_password: str


class Settings(BaseSettings):
    test: TestSettings

    class Config:
        env_file = (Path(__file__).parents[1] / ".env.test").absolute()
        env_file_encoding = "utf-8"
        env_nested_delimiter = "__"


settings_test = Settings()

url = settings_test.test.url_frontend
admin_url = url + "admin"
users_email = settings_test.test.email
openai_token = settings_test.test.openai_token
github_email = settings_test.test.github_email
github_password = settings_test.test.github_password

generative_model = "ChatGPT"
public_va_name = "Marketing Assistant"
your_va_name = RandomWords().get_random_word()
skill_name = "Marketing Skill"

public_template_list = [
    "ai_faq_assistant",
    "fairytale_assistant",
    "fashion_stylist_assistant",
    "life_coaching_assistant",
    "marketing_assistant",
    "nutrition_assistant",
    "multiskill_ai_assistant",
    "dream_persona_openai_prompted",
    "universal_prompted_assistant",
    "deepy_assistant",
]

public_va_names_ru = [
    "dream_persona_ruxglm_prompted",
    "fairytale_ru_assistant",
    "multiskill_ru_assistant",
    "action_stories_ru_assistant",
    "journalist_helper_ru_assistant",
]

lm_service_en_list = [
    "Anthropic Claude v1 (Advanced, 9K tokens)",
    "Anthropic Claude Instant v1 (Advanced, 9K tokens)",
    "GPT-3.5 (Advanced, 4K tokens)",
    "ChatGPT (Advanced, 4K tokens)",
    "ChatGPT (Advanced, 16K tokens)",
    "GPT-4 (Advanced, 8K tokens)",
    "GPT-4 32K (Advanced, 32K tokens)",
    "GPT-JT 6B (Basic, 2K tokens)",
]

lm_service_ru_list = [
    "GPT-3.5 (Advanced, 4K tokens)",
    "ChatGPT (Advanced, 4K tokens)",
    "ChatGPT (Advanced, 16K tokens)",
    "GPT-4 (Advanced, 8K tokens)",
    "GPT-4 32K (Advanced, 32K tokens)",
    "Russian XGLM 4.5B (2K tokens)",
    "ruGPT-3.5-13B (2K tokens)",
]
