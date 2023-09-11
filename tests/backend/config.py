from pydantic import BaseModel, BaseSettings
from pathlib import Path


class LocalUrlSettings(BaseModel):
    frontend: str
    auth_api: str
    distributions_api: str


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
    test_token_user1: str
    test_token_user2: str
    test_token_github1: str
    test_token_github2: str
    openai_token: str


class Settings(BaseSettings):
    url: UrlSettings
    localurl: LocalUrlSettings
    db: DatabaseSettings
    auth: AuthSettings

    class Config:
        env_file = (Path(__file__).parents[2] / ".env").absolute()
        env_file_encoding = "utf-8"
        env_nested_delimiter = "__"


settings_test = Settings()

auth_token = settings_test.auth.test_token
auth_token_user1 = settings_test.auth.test_token_user1
auth_token_user2 = settings_test.auth.test_token_user2

test_token_github1 = settings_test.auth.test_token_github1
test_token_github2 = settings_test.auth.test_token_github2

openai_token = settings_test.auth.openai_token
settings_url = settings_test.localurl

# config for test_auth

auth_endpoint = f"{settings_url.auth_api}"
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
public_va_names_en = ["ai_faq_assistant",
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

public_va_names_ru = ["dream_persona_ruxglm_prompted",
                      "fairytale_ru_assistant",
                      "multiskill_ru_assistant",
                      "action_stories_ru_assistant",
                      "journalist_helper_ru_assistant",

                      ]

lm_service_id_list = [2, 4, 5, 6, 7]
lm_service_id_russian_list = [12, 13]

base_url_distributions_api = settings_url.distributions_api

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
        return f'{title}: {i}'

    return func


counter_auth = create_counter('TestAuth')
counter_distributions = create_counter('TestDistributions')
counter_db = create_counter('TestDB')
