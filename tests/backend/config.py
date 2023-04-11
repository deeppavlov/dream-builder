from pydantic import BaseModel, BaseSettings
from pathlib import Path
from services.auth_api.models import UserCreate, UserValidScheme
from database import models
from sqlalchemy.orm import Session
from sqlalchemy.dialects.postgresql import insert


class LocalUrlSettings(BaseModel):
    frontend: str
    auth_api: str
    distributions_api: str


class LocalDatabaseSettings(BaseModel):
    user: str
    password: str
    host: str
    port: int
    name: str


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
    sub: str
    chat_url: str


class Settings(BaseSettings):
    url: UrlSettings
    localurl: LocalUrlSettings
    db: DatabaseSettings
    localdb: LocalDatabaseSettings
    auth: AuthSettings

    class Config:
        env_file = (Path(__file__).parents[2] / ".env").absolute()
        env_file_encoding = "utf-8"
        env_nested_delimiter = "__"


settings = Settings()
auth_token = settings.auth.test_token
# remove 'local' if we run tests not locally
settings_url = settings.localurl
settings_db = settings.localdb

# config for test_auth


auth_endpoint = f"{settings_url.auth_api}/"
auth_refresh_token = "1refresh_token"


# config for test_db


def clean_testdb(db: Session):
    db.query(models.DialogSession).delete(synchronize_session="fetch")
    db.query(models.PublishRequest).delete(synchronize_session="fetch")
    db.query(models.UserApiToken).delete(synchronize_session="fetch")
    db.query(models.Deployment).delete(synchronize_session="fetch")
    db.query(models.VirtualAssistant).delete(synchronize_session="fetch")
    db.query(models.UserValid).delete(synchronize_session="fetch")
    db.query(models.GoogleUser).delete(synchronize_session="fetch")
    db.query(models.LmService).delete(synchronize_session="fetch")
    db.query(models.ApiToken).delete(synchronize_session="fetch")
    db.query(models.Role).delete(synchronize_session="fetch")
    db.commit()


def clean_testdata_wo_user(db: Session, email):
    google_user_id = db.query(models.GoogleUser.id).filter(models.GoogleUser.email == email).first()[0]
    va_id_list = db.query(models.VirtualAssistant.id).filter(models.VirtualAssistant.author_id == google_user_id).all()
    for va_id in va_id_list:
        db.query(models.DialogSession).filter(models.DialogSession.user_id == 1).delete(synchronize_session="fetch")
        db.query(models.Deployment).filter(models.Deployment.virtual_assistant_id == va_id[0]).delete(
            synchronize_session="fetch"
        )
    db.query(models.PublishRequest).filter(models.PublishRequest.user_id == google_user_id).delete(
        synchronize_session="fetch"
    )
    db.query(models.UserApiToken).filter(models.UserApiToken.user_id == google_user_id).delete(
        synchronize_session="fetch"
    )
    db.query(models.DialogSession).filter(models.DialogSession.user_id == google_user_id).delete(
        synchronize_session="fetch"
    )
    db.query(models.VirtualAssistant).filter(models.VirtualAssistant.author_id == google_user_id).delete(
        synchronize_session="fetch"
    )
    db.commit()
    db.close()


def clean_all_testdata(db: Session, email):
    clean_testdata_wo_user(db, email)
    google_user_id = db.query(models.GoogleUser.id).filter(models.GoogleUser.email == email).first()[0]
    db.query(models.UserValid).filter(models.UserValid.user_id == google_user_id).delete(synchronize_session="fetch")
    db.query(models.GoogleUser).filter(models.GoogleUser.email == email).delete(synchronize_session="fetch")
    db.commit()
    db.close()


db_config = (
    settings_db.user,
    settings_db.password,
    settings_db.host,
    settings_db.port,
    settings_db.name,
)

exist_email = "existemail@gmail.com"
not_exist_email = "not_existemail@gmail.com"
refresh_token = "1token"
refresh_token_updated = "2token"
expire_date = "2032-05-27 14:51:19.092898"
expire_date_updated = "2032-06-27 15:41:19.092898"

exist_sub = "exist_sub"

json_google_user = f"""{{ 
                         "email" : "{exist_email}", 
                         "sub" : "{exist_sub}",
                         "picture" : "picture", 
                         "name" : "name",
                         "given_name" : "given name",
                         "family_name" : "family name"
                         }}"""
google_user = UserCreate.parse_raw(json_google_user)

json_uservalid = f"""{{
                     "refresh_token" : "{refresh_token}", 
                     "is_valid" : "true", 
                     "expire_date" : "{expire_date}"
                       }}"""
uservalid_user = UserValidScheme.parse_raw(json_uservalid)

json_uservalid_updated = f"""{{
                             "refresh_token" : "{refresh_token_updated}", 
                             "is_valid" : "true", 
                             "expire_date" : "{expire_date_updated}"
                               }}"""
uservalid_user_updated = UserValidScheme.parse_raw(json_uservalid_updated)

# json_user_api_token = f"""{{
#                         "id" : "{exist_email}",
#                         "user_id" : "{exist_sub}",
#                         "api_token_id" : "api_token_id",
#                         "token_value" : "token_value",
#                         }}"""

va_data = {
    "cloned_from_id": None,
    "author_id": 1,
    "source": "source",
    "name": "TestVA",
    "display_name": "Test_Assistant",
    "description": "description",
}

# config for test_distribution


base_url_distributions_api = settings_url.distributions_api

assistant_dists_endpoint = f"{base_url_distributions_api}/assistant_dists/"
users_endpoint = f"{base_url_distributions_api}/users/"
api_tokens_endpoint = f"{base_url_distributions_api}/api_tokens/"
dialog_sessions_endpoint = f"{base_url_distributions_api}/dialog_sessions/"
deployments_endpoint = f"{base_url_distributions_api}/deployments/"


def create_mocks_public_dist(db: Session):
    db.scalar(
        insert(models.Role)
            .values(
            id=1,
            name="user",
            can_confirm_publish=True,
            can_set_roles=True,
        )
            .returning(models.Role)
    )

    db.scalar(
        insert(models.LmService)
            .values(
            id=1,
            name="GPT-J 6B",
            display_name="GPT-J 6B",
            description="description",
            project_url="project_url",
        )
            .returning(models.LmService)
    )

    db.scalar(
        insert(models.LmService)
            .values(
            id=2,
            name="BLOOMZ 7B",
            display_name="BLOOMZ 7B",
            description="description",
            project_url="project_url",
        )
            .returning(models.LmService)
    )

    db.scalar(
        insert(models.LmService)
            .values(
            id=3,
            name="GPT-3.5",
            display_name="GPT-3.5",
            description="description",
            project_url="project_url",
        )
            .returning(models.LmService)
    )

    db.scalar(
        insert(models.LmService)
            .values(
            id=4,
            name="ChatGPT",
            display_name="ChatGPT",
            description="description",
            project_url="project_url",
        )
            .returning(models.LmService)
    )

    db.scalar(
        insert(models.GoogleUser)
            .values(
            id=1,
            email="publisher@testmail.com",
            sub=settings.auth.sub,
            picture="picture",
            fullname="publisher",
            given_name="publisher",
            family_name="publisher",
            role_id=1,
        )
            .returning(models.GoogleUser)
    )

    db.scalar(
        insert(models.VirtualAssistant)
            .values(
            id=1,
            cloned_from_id=None,
            author_id=1,
            source="source",
            name="fairytale_assistant",
            display_name="fairytale_assistant",
            description="description",
            date_created="2023-04-10 13:28:46.543905",
        )
            .returning(models.VirtualAssistant)
    )

    db.scalar(
        insert(models.ApiToken)
            .values(
            id=1,
            name="xGPT",
            description="description",
            base_url="base_url",
        )
            .returning(models.ApiToken)
    )

    db.scalar(
        insert(models.Deployment)
            .values(
            id=1,
            virtual_assistant_id=1,
            chat_url=settings.auth.chat_url,
            prompt="You tell fairy tales",
            lm_service_id=3,
        )
            .returning(models.Deployment)
    )

    db.scalar(
        insert(models.PublishRequest)
            .values(
            id=1,
            slug="fairytale_assistant",
            date_created="2023-04-10 13:28:46.543905",
            virtual_assistant_id=1,
            user_id=1,
            is_confirmed=True,
            confirmed_by_user_id=1,
        )
            .returning(models.PublishRequest)
    )

    db.commit()


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
