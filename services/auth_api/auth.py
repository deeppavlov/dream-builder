from datetime import datetime, timedelta
from typing import Mapping

import aiohttp
import requests
from fastapi import APIRouter, Depends, Header, HTTPException, status
from google.auth import jwt
from google_auth_oauthlib.flow import Flow
from sqlalchemy.orm import Session


import database.crud as crud
from database.core import init_db
from database.models import UserValid
from services.auth_api.config import settings, URL_TOKENINFO, CLIENT_SECRET_FILENAME
from services.auth_api.models import UserCreate, User, UserValidScheme, UserModel

router = APIRouter(prefix="/auth")

SessionLocal = init_db(settings.db.user, settings.db.password, settings.db.host, settings.db.port, settings.db.name)

flow = Flow.from_client_secrets_file(client_secrets_file=CLIENT_SECRET_FILENAME, scopes=None)
flow.redirect_uri = settings.auth.redirect_uri


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


async def _fetch_user_info_by_access_token(access_token: str) -> dict[str, str]:
    """
    Fetches user_info using access token by request to Google API
    Checks if access token is valid by date.
    """
    async with aiohttp.ClientSession() as session:
        async with session.post(URL_TOKENINFO + access_token) as resp:
            response = await resp.json()
            resp_status = resp.status

    if resp_status != 200:
        raise ValueError(f"Access token has expired or token is bad.\nResponse body:\n{response}")

    return response


@router.get("/token", status_code=status.HTTP_200_OK)
async def validate_jwt(token: str = Header(), db: Session = Depends(get_db)):
    """
    Exchanges access token for user_info and validates it by aud, presence in userDB and expiration date or otherwise
    Check is carried out via `_fetch_user_info_by_access_token` function
    raise HTTPException with status_code == 400
    """
    if token == settings.auth.test_token:
        return UserModel(
            id=0,
            email="cheater@deepdream.builders",
            sub="subway?",
            picture="pic",
            fullname="Deep Pavlov",
            given_name="Deep",
            family_name="Pavlov",
        )

    try:
        data = await _fetch_user_info_by_access_token(access_token=token)

        validate_aud(data["aud"])
        validate_email(data["email"], db)
        user = crud.get_user_by_email(db, data["email"])

        return UserModel(
            id=user.id,
            email=user.email,
            sub=user.sub,
            picture=user.picture,
            fullname=user.fullname,
            given_name=user.given_name,
            family_name=user.family_name,
        )

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


def validate_aud(input_aud: str) -> None:
    base = settings.auth.google_client_id

    if input_aud != base:
        raise ValueError("Audience is not valid!")


def validate_email(email: str, db: Session) -> None:

    if not crud.check_user_exists(db, email):
        raise ValueError("User is not listed in the database")


# @router.get("/login")
def save_user(data: Mapping[str, str], db: Session = Depends(get_db)):
    """
    TODO: endpoint -> method due to no usage from frontend
    """
    if not crud.check_user_exists(db, data["email"]):
        user = UserCreate(**data)
        crud.add_google_user(db, user)
        return User(**data)

    user = crud.get_user_by_email(db, data["email"]).__dict__
    return User(**user, name=user["fullname"])


@router.put("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(refresh_token: str = Header(), db: Session = Depends(get_db)) -> None:
    crud.set_users_refresh_token_invalid(db, refresh_token)


@router.post("/exchange_authcode")
async def exchange_authcode(auth_code: str, db: Session = Depends(get_db)) -> dict[str, str]:
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
    try:
        flow.fetch_token(code=auth_code)
    except ValueError as e:
        raise HTTPException(status_code=402, detail=str(e))

    credentials = flow.credentials
    access_token = credentials.token
    refresh_token = credentials.refresh_token
    jwt_data = credentials._id_token

    user_info = jwt.decode(jwt_data, verify=False)
    save_user(user_info, db)
    user = User(**user_info)
    del user.sub

    expire_date = datetime.now() + timedelta(days=settings.auth.refresh_token_lifetime_days)

    user_valid = UserValidScheme(refresh_token=refresh_token, is_valid=True, expire_date=expire_date)
    email = user_info["email"]
    crud.add_user_to_uservalid(db, user_valid, email)
    return {"token": access_token, "refresh_token": refresh_token, **user.dict()}


@router.post("/update_token")
async def update_access_token(refresh_token: str, db: Session = Depends(get_db)) -> dict[str, str]:
    user: UserValid = crud.get_uservalid_by_refresh_token(db, refresh_token)

    if not user:
        raise HTTPException(status_code=401, detail="User is not authenticated!")

    if not _check_refresh_token_validity(user.expire_date):
        # redirect?
        raise HTTPException(status_code=401, detail="Refresh token has expired!")

    info = settings.auth_client_info.copy()
    info.update(
        {
            "grant_type": "refresh_token",
            "refresh_token": refresh_token,
        }
    )
    response = requests.post("https://oauth2.googleapis.com/token", data=info).json()
    access_token = response["access_token"]
    return {"token": access_token}


def _check_refresh_token_validity(expire_date: datetime) -> bool:
    if datetime.now() > expire_date:
        return False

    return True
