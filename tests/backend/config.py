from pydantic import BaseModel, BaseSettings
from services.auth_api.models import UserCreate, UserValidScheme
from database import models
from sqlalchemy.orm import Session


class UrlSettings(BaseModel):
    frontend: str
    auth_api: str
    distributions_api: str


class TestUrlSettings(BaseModel):
    frontend: str
    auth_api: str
    distributions_api: str


class DatabaseSettings(BaseModel):
    user: str
    password: str
    host: str
    port: int
    name: str


class TestDatabaseSettings(BaseModel):
    user: str
    password: str
    host: str
    port: int
    name: str


class AuthSettings(BaseModel):
    google_client_id: str
    test_token: str


class Settings(BaseSettings):
    url: UrlSettings
    testurl: TestUrlSettings
    db: DatabaseSettings
    testdb: TestDatabaseSettings
    auth: AuthSettings

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        env_nested_delimiter = "__"


settings = Settings()

# config for test_db

def clean_testdb(db: Session):
    db.query(models.Deployment).delete(synchronize_session="fetch")
    db.query(models.VirtualAssistant).delete(synchronize_session="fetch")
    db.query(models.UserValid).delete(synchronize_session="fetch")
    db.query(models.GoogleUser).delete(synchronize_session="fetch")
    db.commit()


def clean_testdata(db: Session, email):
    google_user_id = db.query(models.GoogleUser.id).filter(models.GoogleUser.email == email).first()[0]
    va_id = db.query(models.VirtualAssistant.id).filter(models.VirtualAssistant.author_id == google_user_id).first()[0]
    db.query(models.Deployment).filter(models.Deployment.virtual_assistant_id == va_id).delete(synchronize_session="fetch")
    db.query(models.VirtualAssistant).filter(models.VirtualAssistant.author_id == google_user_id).delete(synchronize_session="fetch")
    db.query(models.UserValid).filter(models.UserValid.user_id == google_user_id).delete(synchronize_session="fetch")
    db.query(models.GoogleUser).filter(models.GoogleUser.email == email).delete(synchronize_session="fetch")
    db.commit()


db_config = (
    settings.testdb.user,
    settings.testdb.password,
    settings.testdb.host,
    settings.testdb.port,
    settings.testdb.name,
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

json_user_api_token = f"""{{ 
                         "id" : "{exist_email}", 
                         "user_id" : "{exist_sub}",
                         "api_token_id" : "api_token_id", 
                         "token_value" : "token_value",
                         }}"""

va_data = {
           "cloned_from_id": None,
           "author_id": "1",
           "source": "source",
           "name": "Test",
           "display_name": "Test_Assistant",
           "description": "description"
            }


# config for test_auth


header_token = {
    "token": settings.auth.test_token,
    "accept": "application/json"
}
header_logout = headers = {
    "accept": "*/*",
    "refresh-token": f"{refresh_token}",
}
header_exchange_authcode = {
    'accept': 'application/json',
    'content-type': 'application/x-www-form-urlencoded',
}
params_exchange_authcode = {
    'auth_code': f'{settings.auth.test_token}',
}
params_exchange_bad_authcode = {
    'auth_code': f'{settings.auth.test_token}',
}
header_update_token = {
    'accept': 'application/json',
    'content-type': 'application/x-www-form-urlencoded',
}

params_update_token = {
    'refresh_token': f"{refresh_token}",
}



token_endpoint = f"{settings.testurl.auth_api}/token"
logout_endpoint = f"{settings.testurl.auth_api}/logout"
exchange_authcode_endpoint = f"{settings.testurl.auth_api}/exchange_authcode"
update_token_endpoint = f"{settings.testurl.auth_api}/update_token"


# config for test_distribution
base_url_distributions_api = settings.testurl.distributions_api

auth_token = settings.auth.test_token


assistant_dists_endpoint = f"{base_url_distributions_api}/assistant_dists/"
users_endpoint = f"{base_url_distributions_api}/users/"
api_tokens_endpoint = f"{base_url_distributions_api}/api_tokens/"
dialog_sessions_endpoint = f"{base_url_distributions_api}/dialog_sessions/"
deployments_endpoint = f"{base_url_distributions_api}/deployments/"


