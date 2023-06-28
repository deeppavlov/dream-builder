import random
from datetime import datetime, timedelta
from typing import Mapping, Annotated, Coroutine

import aiohttp
import requests
from fastapi import APIRouter, Depends, Header, HTTPException, status, Request
from fastapi.responses import RedirectResponse
from google.auth import jwt
from google_auth_oauthlib.flow import Flow
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from sqlalchemy.orm import Session
from urllib.parse import urlencode, parse_qs

import database.crud as crud
import database.models
from database.core import init_db
from database.models import GoogleUserValid, GithubUserValid, GeneralUser
from apiconfig.config import (
    settings,
    URL_TOKENINFO,
    CLIENT_SECRET_FILENAME,
    GITHUB_AUTH_URL,
    GITHUB_TOKENINFO,
    GITHUB_URL_USERINFO,
)
from services.shared.user import User, UserToken
from services.auth_api.models import UserCreate, UserRead, UserValidScheme, UserModel
from services.auth_api.models import UserCreate, UserValidScheme, GithubUserCreate, GithubUser

router = APIRouter(prefix="/auth")

SessionLocal = init_db(settings.db.user, settings.db.password, settings.db.host, settings.db.port, settings.db.name)

flow: Flow = Flow.from_client_secrets_file(client_secrets_file=CLIENT_SECRET_FILENAME, scopes=None)
flow.redirect_uri = settings.auth.redirect_uri

github_params = settings.github_auth_client_info
# example: https://github.com/login/oauth/authorize?client_id=1337&client_secret=1453
github_auth_url_with_params = f"{GITHUB_AUTH_URL}?{urlencode(github_params)}"
GITHUB = "github"
GOOGLE = "google"


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
    if not crud.check_google_user_exists(db, email):
        raise ValueError("User is not listed in the database")


# def save_user(data: Mapping[str, str], db: Session = Depends(get_db)):
#     if not crud.check_google_user_exists(db, data["email"]):
#         user = UserCreate(**data)
#         return UserRead.from_orm(crud.add_google_user(db, user))
#
#     user = crud.get_user_by_sub(db, data["sub"])
#     user = crud.update_user(db, user.id, **data)
#     return UserRead.from_orm(user)
#

async def _fetch_gh_user_info_by_access_token(token: str):
    header = {
        "Authorization": "".join(["Bearer ", token]),
    }
    print(header)
    async with aiohttp.ClientSession(headers=header) as session:
        async with session.get(GITHUB_URL_USERINFO) as resp:
            response = await resp.json()
            resp_status = resp.status
    if resp_status != 200:
        raise ValueError(f"Github token is bad. Response: {response, resp_status}")

    return response


def validate_date(user: GithubUserValid):
    if datetime.now() > user.expire_date:
        raise ValueError("Token has expired")


async def validate_gh(token: str, db: Session = Depends(get_db)) -> User:
    """
    """
    try:
        uservalid_info_from_db = crud.get_github_uservalid_by_access_token(db, token)
        if not uservalid_info_from_db:
            raise ValueError("The user with this token couldn't be found or token is not valid.")

        validate_date(uservalid_info_from_db)
        user_info_from_github = await _fetch_gh_user_info_by_access_token(token=token)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    user_id = crud.get_general_user_by_outer_id(db, user_info_from_github["id"], GITHUB).id
    return User(
        id=user_id,
        outer_id=user_info_from_github["id"],
        email=user_info_from_github["email"],
        picture=user_info_from_github["avatar_url"],
        name=user_info_from_github["name"] or user_info_from_github["login"]
    )


@router.get("/token", status_code=status.HTTP_200_OK)
async def validate_jwt(token: str = Header(), auth_type: str = Header(default=None),
                       db: Session = Depends(get_db)) -> User:
    """
    `auth_type: Annotated[str | None, Header()] = None` means that auth_type header field is optional and may be None.

    Exchanges access token for user_info and validates it by aud, presence in userDB and expiration date or otherwise
    Check is carried out via `_fetch_user_info_by_access_token` function
    raise HTTPException with status_code == 400
    """
    if token == settings.auth.test_token:
        user: database.models.GoogleUser = crud.get_user_by_sub(db, "106152631136730592791")
        name = user.fullname
        return User(
            id=user.user_id,
            outer_id=user.sub,
            email=user.email,
            picture=user.picture,
            name=name
        )

    if auth_type == GITHUB:
        return await validate_gh(token, db)

    try:
        data = await _fetch_user_info_by_access_token(access_token=token)

        validate_aud(data["aud"])
        validate_email(data["email"], db)
        user: database.models.GoogleUser = crud.get_user_by_sub(db, data["sub"])
        # user = crud.update_user(db, user.id, **data)

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    return User(
        id=user.user_id,
        outer_id=user.sub,
        email=user.email,
        picture=user.picture,
        name=user.name or user.fullname
    )


@router.put("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(token: str = Header(), auth_type: Annotated[str | None, Header()] = None,
                 db: Session = Depends(get_db)) -> None:
    """
    refresh_token -> token
    """
    if auth_type == GITHUB:
        crud.set_github_users_access_token_invalid(db, token)
    else:
        crud.set_users_refresh_token_invalid(db, token)


@router.post("/exchange_authcode")
async def exchange_authcode(auth_code: str, auth_type: str = Header(default=""),
                            db: Session = Depends(get_db)) -> UserToken:
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
        return await _exchange_github_code(auth_code, db)

    return await _exchange_google_code(auth_code, db)


async def _exchange_google_code(auth_code: str, db: Session):
    try:
        flow.fetch_token(code=auth_code)
    except ValueError as e:
        raise HTTPException(status_code=402, detail=str(e))

    credentials = flow.credentials
    access_token = credentials.token
    refresh_token = credentials.refresh_token
    jwt_data = credentials._id_token

    user_info = jwt.decode(jwt_data, verify=False)

    if crud.check_google_user_exists(db, user_info["sub"]):
        general_user = crud.get_general_user_by_outer_id(db, user_info["sub"], GOOGLE)
    else:
        general_user = crud.add_user(
                    db=db,
                    provider_name=GOOGLE,
                    outer_id=user_info["sub"],
                    email=user_info["email"],
                    name=user_info["name"],
                    picture=user_info["picture"],
                )
        crud.add_google_user(db, UserCreate(**user_info), general_user.id)

    expire_date = datetime.now() + timedelta(days=settings.auth.refresh_token_lifetime_days)

    user_valid = UserValidScheme(user_id=general_user.id, refresh_token=refresh_token, is_valid=True,
                                 expire_date=expire_date)
    crud.add_user_to_uservalid(db, user_valid)
    return UserToken(**User.from_orm(general_user).__dict__,
                     token=access_token,
                     refresh_token=refresh_token
                     )


@router.post("/update_token")
async def update_access_token(refresh_token: str, auth_type: Annotated[str | None, Header()] = None,
                              db: Session = Depends(get_db)) -> dict[str, str]:
    user: GoogleUserValid = crud.get_uservalid_by_refresh_token(db, refresh_token)

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


async def _exchange_github_code(code: str, db: Session = Depends(get_db)) -> UserToken:
    user_data, access_token = await _fetch_user_info_by_github_code(code)

    github_id = user_data["id"]

    github_user_create = GithubUserCreate(
        email=user_data["email"],
        github_id=github_id,
        picture=user_data["avatar_url"],
        name=user_data["name"] or user_data["login"],
    )

    if crud.check_github_user_exists(db, github_id):
        general_user = crud.get_general_user_by_outer_id(db, github_id, GITHUB)
    else:
        general_user = crud.add_user(
            db=db,
            provider_name=GITHUB,
            outer_id=str(github_user_create.github_id),
            email=github_user_create.email,
            name=github_user_create.name,
            picture=github_user_create.picture,
        )
        crud.add_github_user(db, github_user_create, general_user.id)

    crud.add_github_uservalid(
        db=db,
        user_id=general_user.id,
        access_token=access_token
    )

    return UserToken(
        id=general_user.id,
        email=github_user_create.email,
        outer_id=github_user_create.github_id,
        picture=github_user_create.picture,
        name=github_user_create.name,
        token=access_token,
    )


async def _fetch_user_info_by_github_code(code: str) -> tuple[dict[str, str], str]:
    endpoint_to_fetch_user_info = _get_github_tokeninfo_endpoint(code)

    async with aiohttp.ClientSession() as session:
        async with session.get(endpoint_to_fetch_user_info) as response:
            body = await response.text()

        if _is_token_good(body):
            access_token = parse_qs(body)["access_token"][0]
        else:
            raise HTTPException(status_code=400, detail="bad code")

    async with aiohttp.ClientSession(headers={"Authorization": "Bearer " + access_token}) as session:
        async with session.get(GITHUB_URL_USERINFO) as response:
            user_data: dict = await response.json()

    return user_data, access_token


def _is_token_good(response_text: str) -> bool:
    """
    GitHub returns 200 status code regardless of request success, so it is required to define success of request.

    Example of success response body:
    ```
    access_token=token&scope=read%3Auser&token_type=bearer
    ```
    Example of bad response body:
    ```
    error=bad_verification_code&error_description=The+code+passed+is+incorrect+or+expired.&
    error_uri=...
    ```
    """
    success_indicator = "access_token="

    return success_indicator in response_text


def _get_github_tokeninfo_endpoint(code: str) -> str:
    auth_client_params = settings.github_auth_client_info
    auth_client_params.update({"code": code})
    return f"{GITHUB_TOKENINFO}?{urlencode(auth_client_params)}"
