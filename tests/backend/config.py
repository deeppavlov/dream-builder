from pydantic import BaseModel, BaseSettings
from pathlib import Path


class TestSettings(BaseModel):
    url_frontend: str
    url_auth_api: str
    url_distributions_api: str

    token_admin: str
    token_github1: str
    token_github2: str
    openai_token: str


class Settings(BaseSettings):
    test: TestSettings

    class Config:
        env_file = (Path(__file__).parents[1] / ".env.test").absolute()
        env_file_encoding = "utf-8"
        env_nested_delimiter = "__"


settings_test = Settings()

admin_token = settings_test.test.token_admin
test_token_github1 = settings_test.test.token_github1
test_token_github2 = settings_test.test.token_github2

openai_token = settings_test.test.openai_token
settings_url = settings_test.test

# config for test_auth

auth_endpoint = f"{settings_url.url_auth_api}"
auth_refresh_token = "refresh_token"

# config for test_distribution

va_data = {
    "cloned_from_id": None,
    "author_id": 1,
    "source": "source",
    "name": "TestVA",
    "display_name": "Test_Assistant",
    "description": "Test_Description",
}
public_va_names_en = [
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

public_va_names_visible_en = [
    "ai_faq_assistant",
    "fairytale_assistant",
    "fashion_stylist_assistant",
    "life_coaching_assistant",
    "marketing_assistant",
    "nutrition_assistant",
    "multiskill_ai_assistant",
    "dream_persona_openai_prompted",
]

public_va_names_ru = [
    "dream_persona_ruxglm_prompted",
    "fairytale_ru_assistant",
    "multiskill_ru_assistant",
    "action_stories_ru_assistant",
    "journalist_helper_ru_assistant",
]

lm_service_id_en_list = [2, 4, 5, 6, 7]
lm_service_id_ru_list = [4, 5, 6, 7, 12, 13]

lm_service_id_en_nominal_list = [2, 4, 5, 6, 7, 8, 9, 10]
lm_service_id_ru_nominal_list = [4, 5, 6, 7, 8, 12, 13]

lm_service_id_union_list = [2, 4, 5, 6, 7, 8, 9, 10, 12, 13]


base_url_distributions_api = settings_url.url_distributions_api

assistant_dists_endpoint = f"{base_url_distributions_api}/assistant_dists"
components_endpoint = f"{base_url_distributions_api}/components"
users_endpoint = f"{base_url_distributions_api}/users"
api_keys_endpoint = f"{base_url_distributions_api}/api_keys"
dialog_sessions_endpoint = f"{base_url_distributions_api}/dialog_sessions"
deployments_endpoint = f"{base_url_distributions_api}/deployments"
lm_services_endpoint = f"{base_url_distributions_api}/lm_services"
admin_endpoint = f"{base_url_distributions_api}/admin/publish_request"


def create_counter(title: str):
    i = 0

    def func():
        nonlocal i
        i += 1
        return f"{title}: {i}"

    return func


counter_auth = create_counter("TestAuth")
counter_distributions = create_counter("TestDistributions")
counter_db = create_counter("TestDB")
counter_ui = create_counter("TestUI")
