from datetime import datetime

from fastapi import APIRouter, Depends, Header, HTTPException, status
from google.auth import jwt
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
from sqlalchemy.orm import Session
from requests import Request

import services.auth_api.db.crud as crud
from services.auth_api.db.db import init_db
from services.auth_api.db.db_models import UserValid
from services.auth_api.const import GOOGLE_SCOPE, CLIENT_INFO
from services.auth_api.config import settings
from services.auth_api.models import UserCreate, User, UserValidScheme

router = APIRouter(prefix="/auth")

SessionLocal = init_db(settings.db.user, settings.db.password, settings.db.host, settings.db.port, settings.db.name)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/token", status_code=status.HTTP_200_OK)
async def validate_jwt(jwt_data: str = Header()):
    """
    Decode input jwt-token, validate date, check user in db or otherwise sign them up
    """
    if jwt_data == settings.auth.test_token:
        return
    try:
        data = jwt.decode(jwt_data, verify=False)

        # noinspection PyTypeChecker
        validate_date(data["nbf"], data["exp"])  # nbf and exp fields are int
        validate_aud(data["aud"])
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


def validate_aud(input_aud: str) -> None:
    base = settings.google_client_id

    if input_aud != base:
        raise ValueError("Audience is not valid! ")


def validate_date(nbf: int, exp: int) -> None:
    nbf = datetime.fromtimestamp(nbf)
    exp = datetime.fromtimestamp(exp)
    now = datetime.now()

    if now < nbf or now > exp:
        raise ValueError("Date of token is not valid!")


@router.get("/login", status_code=status.HTTP_200_OK, dependencies=[Depends(validate_jwt)])
async def login(jwt_data: str = Header(), db: Session = Depends(get_db)):
    data = jwt.decode(jwt_data, verify=False)

    user_valid = UserValidScheme(email=data["email"], token=jwt_data, is_valid=True)
    crud.add_user_to_uservalid(db, user_valid, data["email"])

    if not crud.check_user_exists(db, data["email"]):
        user = UserCreate(**data)
        crud.add_google_user(db, user)
        return User(**data)

    return User(**crud.get_user_by_email(db, data["email"]))


@router.put("/logout", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(validate_jwt)])
async def logout(jwt_data: str = Header(), db: Session = Depends(get_db)):
    data = jwt.decode(jwt_data, verify=False)
    crud.set_users_token_invalid(db, data["email"])


@router.get("/exchange_authcode")
async def exchange_authcode(auth_code: str, db: Session = Depends(get_db)):
    """
    Exchanges authorization code for access token

    1) Frontend sends info with clientID, redirectURI and scope.
    2) The user logs in and grants permission to the app
    3) OAuth2 redirects user to specified redirectURI along with an AUTHORIZATION CODE

    4) frontend sends AUTHORIZATION CODE  to the backend
    5) Backend sends POST-request to google along with app_info and auth_code.
    6) Google responds with an access token and refresh token
    7) Access token to authenticate user
    8) post request to exchange the refresh token for access token
    """
    flow = Flow.from_client_secrets_file(client_secrets_file='client_secret.json',
                                         scopes=GOOGLE_SCOPE)
    flow.fetch_token(authorization_code=auth_code)
    credentials = flow.credentials
    access_token = credentials.token
    refresh_token = credentials.refresh_token

    user_info = jwt.decode(access_token, verify=False)
    user_valid = UserValidScheme(token=refresh_token, is_valid=True)
    crud.add_user_to_uservalid(db, user_valid, user_info["email"])

    return {"token": access_token}


@router.get("/update_token")
async def update_access_token(token: str = Header(), db: Session = Depends(get_db)):
    """
    TODO: add updating refresh_token
        1. `expire_date` attribute required
        2. `expire_date` field in database required
        3.
    """
    email = jwt.decode(token, verify=False)["email"]

    user = crud.get_uservalid_by_email(db, email)
    refresh_token = user.token

    if not _check_refresh_token_validity(user.expire_date):
        # redirect?
        raise HTTPException(status_code=401, detail="Refresh token has expired!")

    info = CLIENT_INFO.copy()
    info.update({"refresh_token": refresh_token})
    creds = Credentials.from_authorized_user_info(info=info, scopes=GOOGLE_SCOPE)

    creds.refresh(Request())
    access_token = creds.token
    return {"token": access_token}


def _check_refresh_token_validity(expire_date: datetime) -> bool:
    if datetime.now() > expire_date:
        return False

    return True
