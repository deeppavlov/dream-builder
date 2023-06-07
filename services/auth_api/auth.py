from datetime import datetime, timedelta
from typing import Mapping

import aiohttp
import requests
from fastapi import APIRouter, Depends, Header, HTTPException, status
from fastapi.responses import RedirectResponse
from google.auth import jwt
from google_auth_oauthlib.flow import Flow
from sqlalchemy.orm import Session
from urllib.parse import urlencode, parse_qs

import database.crud as crud
from database.core import init_db
from database.models import UserValid, GithubUserValid
from apiconfig.config import (
    settings,
    URL_TOKENINFO,
    CLIENT_SECRET_FILENAME,
    GITHUB_AUTH_URL,
    GITHUB_TOKENINFO,
    GITHUB_URL_USERINFO,
)
from services.auth_api import schemas
from services.auth_api.models import UserCreate, UserRead, UserValidScheme, UserModel
from services.auth_api.models import UserCreate, User, UserValidScheme, GithubUserCreate, GithubUser

router = APIRouter(prefix="/auth")

SessionLocal = init_db(settings.db.user, settings.db.password, settings.db.host, settings.db.port, settings.db.name)

flow = Flow.from_client_secrets_file(client_secrets_file=CLIENT_SECRET_FILENAME, scopes=None)
flow.redirect_uri = settings.auth.redirect_uri

github_params = settings.github_auth_client_info
# example: https://github.com/login/oauth/authorize?client_id=1337&client_secret=1453
github_auth_url_with_params = f"{GITHUB_AUTH_URL}?{urlencode(github_params)}"
GITHUB = "github"


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
        raise ValueError(f"Access token has expired or token is bad. Response: {response}")

    return response


def _check_refresh_token_validity(expire_date: datetime) -> bool:
    if datetime.now() > expire_date:
        return False

    return True


def validate_aud(input_aud: str) -> None:
    base = settings.auth.google_client_id

    if input_aud != base:
        raise ValueError("Audience is not valid!")


def validate_email(email: str, db: Session) -> None:
    if not crud.check_user_exists(db, email):
        raise ValueError("User is not listed in the database")


def save_user(data: Mapping[str, str], db: Session = Depends(get_db)):
    if not crud.check_user_exists(db, data["email"]):
        user = UserCreate(**data)
        return UserRead.from_orm(crud.add_google_user(db, user))

    user = crud.get_user_by_sub(db, data["sub"])
    user = crud.update_user(db, user.id, **data)
    return UserRead.from_orm(user)


async def _fetch_gh_user_info_by_access_token(token: str):
    header = {"Authorizaton": "Bearer " + token}
    async with aiohttp.ClientSession(headers=header) as session:
        async with session.get(GITHUB_URL_USERINFO) as resp:
            response = await resp.json()
            resp_status = resp.status
    if resp_status != 200:
        raise ValueError(f"Github token is bad. Response: {response}")

    return response


def validate_date(user: GithubUserValid):
    if user.expire_date > datetime.now():
        raise ValueError("Token has expired")


async def validate_gh(token: str = Header(), db: Session = Depends(get_db)):
    """
    """
    if token == settings.auth.test_token:
        return schemas.User.from_orm(crud.get_user_by_sub(db, "106152631136730592791"))
    try:
        uservalid_info_from_db = crud.get_github_uservalid_by_access_token(db, token)
        validate_date(uservalid_info_from_db)
        user_info_from_github = await _fetch_gh_user_info_by_access_token(token=token)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    # TODO: return github user info
    # return GithubUser(
    #     id=uservalid_info_from_db.id,
    #     github_id=user_info_from_github.id,
    #     email=user_info_from_github.email,
    # )


@router.get("/token", status_code=status.HTTP_200_OK)
async def validate_jwt(token: str = Header(), auth_type: str = Header(), db: Session = Depends(get_db)):
    """
    Exchanges access token for user_info and validates it by aud, presence in userDB and expiration date or otherwise
    Check is carried out via `_fetch_user_info_by_access_token` function
    raise HTTPException with status_code == 400
    """
    if token == settings.auth.test_token:
        return schemas.User.from_orm(crud.get_user_by_sub(db, "106152631136730592791"))

    if auth_type == GITHUB:
        return await validate_gh(token, db)

    try:
        data = await _fetch_user_info_by_access_token(access_token=token)

        validate_aud(data["aud"])
        validate_email(data["email"], db)
        user = crud.get_user_by_sub(db, data["sub"])
        # user = crud.update_user(db, user.id, **data)

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    return schemas.User.from_orm(user)


@router.put("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(refresh_token: str = Header(), github_access_token: str = Header(), db: Session = Depends(get_db)) -> None:
    if github_access_token:
        crud.set_github_users_access_token_invalid(db, github_access_token)
        return

    crud.set_users_refresh_token_invalid(db, refresh_token)


@router.post("/exchange_authcode")
async def exchange_authcode(auth_code: str, auth_type: str = Header(), db: Session = Depends(get_db)) -> dict[str, str]:
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
    if auth_type == GITHUB:
        return await exchange_github_code(auth_code, db)

    try:
        flow.fetch_token(code=auth_code)
    except ValueError as e:
        raise HTTPException(status_code=402, detail=str(e))

    credentials = flow.credentials
    access_token = credentials.token
    refresh_token = credentials.refresh_token
    jwt_data = credentials._id_token

    user_info = jwt.decode(jwt_data, verify=False)
    user = save_user(user_info, db)
    # del user.sub

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


# TEST ONLY
@router.get("/github_auth")
async def github_auth():
    return RedirectResponse(github_auth_url_with_params)


async def exchange_github_code(code: str, db: Session = Depends(get_db)):
    code_params = settings.github_auth_client_info.update({"code": code})
    endpoint = f"{GITHUB_TOKENINFO}?{urlencode(code_params)}"
    response = requests.post(endpoint)
    access_token = parse_qs(response.text)["access_token"][0]
    user_data = requests.get(GITHUB_URL_USERINFO, headers={"Authorization": "Bearer " + access_token}).json()
    github_user_create = GithubUserCreate(
        email=user_data["email"],
        github_id=user_data["github_id"],
        picture=user_data["avatar_url"],
        name=user_data["name"],
    )
    crud.add_github_user(db, github_user_create)
    crud.add_github_uservalid(db=db, github_id=user_data["github_id"], access_token=access_token)
    return {"token": access_token, **github_user_create.__dict__}
