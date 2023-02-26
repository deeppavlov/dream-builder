from pydantic import BaseModel, BaseSettings
from services.auth_api.models import UserCreate, UserValidScheme
from services.auth_api.db.db_models import GoogleUser, UserValid
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
    db.query(UserValid).delete(synchronize_session="fetch")
    db.query(GoogleUser).delete(synchronize_session="fetch")
    db.commit()


def clean_testdata(db: Session, email):
    google_user_id = db.query(GoogleUser.id).filter(GoogleUser.email == email).first()[0]
    db.query(UserValid).filter(UserValid.user_id == google_user_id).delete(synchronize_session="fetch")
    db.query(GoogleUser).filter(GoogleUser.email == email).delete(synchronize_session="fetch")
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
refresh_token = "1str"

json_google_user = f"""{{
                         "email": "{exist_email}", 
                         "sub": "str",
                         "picture": "str", 
                         "name": "str",
                         "given_name": "str",
                         "family_name": "str"
                         }}"""
google_user = UserCreate.parse_raw(json_google_user)

json_uservalid = f"""{{
                     "refresh_token": "{refresh_token}", 
                     "is_valid": "true", 
                     "expire_date": "2032-05-27 14:51:19.092898"
                       }}"""
uservalid_user = UserValidScheme.parse_raw(json_uservalid)



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

