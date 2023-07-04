from datetime import datetime, timedelta
from typing import Union
from urllib.parse import urlencode, parse_qs

import aiohttp
from fastapi import HTTPException
from google.auth import jwt
from sqlalchemy.orm import Session
from google_auth_oauthlib.flow import Flow

import database
from apiconfig.config import settings, CLIENT_SECRET_FILENAME
from database import crud
from database.models import GithubUserValid, GoogleUserValid
from services.auth_api import auth_type
from services.auth_api.models import GithubUserCreate, UserCreate, UserValidScheme
from services.shared.user import UserToken, User

flow: Flow = Flow.from_client_secrets_file(client_secrets_file=CLIENT_SECRET_FILENAME, scopes=None)


class GithubAuth(auth_type.OAuth):
    """
    GET AUTH_URL=https://github.com/login/oauth/authorize -- to get link with auth page
    POST AUTH_URL = "https://github.com/login/oauth/authorize" -- to exchange auth_code for access token
    GET URL_USERINFO = "https://api.github.com/user" -- to fetch user info by access token
    """

    PROVIDER_NAME = "github"
    URL_USERINFO = "https://api.github.com/user"
    AUTH_URL = "https://github.com/login/oauth/authorize"
    URL_TOKENINFO = "https://github.com/login/oauth/access_token"
    CLIENT_PARAMETERS = settings.github_auth_client_info
    GITHUB_AUTH_URL_WITH_PARAMS = f"{AUTH_URL}?{urlencode(CLIENT_PARAMETERS)}"

    async def validate_token(self, db: Session, token: str) -> User:
        try:
            uservalid_info_from_db = crud.get_github_uservalid_by_access_token(db, token)
            if not uservalid_info_from_db:
                raise ValueError("The user with this token couldn't be found or token is not valid.")

            self._validate_date(uservalid_info_from_db.expire_date)
            user_info_from_github = await self._fetch_user_info_by_access_token(token=token)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))

        user_id = crud.get_general_user_by_outer_id(db, user_info_from_github["id"], self.PROVIDER_NAME).id
        return User(
            id=user_id,
            outer_id=user_info_from_github["id"],
            email=user_info_from_github["email"],
            picture=user_info_from_github["avatar_url"],
            name=user_info_from_github["name"] or user_info_from_github["login"],
        )

    async def logout(self, db: Session, token: str):
        crud.set_github_users_access_token_invalid(db, token)

    async def exchange_authcode(self, db: Session, auth_code: str) -> UserToken:
        user_data, access_token = await self._fetch_user_info_by_auth_code(auth_code)

        github_id = user_data["id"]

        github_user_create = GithubUserCreate(
            email=user_data["email"],
            github_id=github_id,
            picture=user_data["avatar_url"],
            name=user_data["name"] or user_data["login"],
        )

        if crud.check_github_user_exists(db, github_id):
            general_user = crud.get_general_user_by_outer_id(db, github_id, self.PROVIDER_NAME)
        else:
            general_user = crud.add_user(
                db=db,
                provider_name=self.PROVIDER_NAME,
                outer_id=str(github_user_create.github_id),
            )
            crud.add_github_user(db, github_user_create, general_user.id)

        crud.add_github_uservalid(db=db, user_id=general_user.id, access_token=access_token)

        return UserToken(
            id=general_user.id,
            email=github_user_create.email,
            outer_id=github_user_create.github_id,
            picture=github_user_create.picture,
            name=github_user_create.name,
            token=access_token,
        )

    ########################################################################

    @staticmethod
    def _validate_date(expire_data: datetime):
        if datetime.now() > expire_data:
            raise ValueError("Token has expired")

    async def _fetch_user_info_by_access_token(self, token: str):
        header = {
            "Authorization": "".join(["Bearer ", token]),
        }
        async with aiohttp.ClientSession(headers=header) as session:
            async with session.get(self.URL_USERINFO) as resp:
                response = await resp.json()
                resp_status = resp.status
        if resp_status != 200:
            raise ValueError(f"Github token is bad. Response: {response, resp_status}")

        return response

    async def _fetch_user_info_by_auth_code(self, code: str) -> tuple[dict[str, str], str]:
        endpoint_to_fetch_user_info = self._get_github_tokeninfo_endpoint(code)

        async with aiohttp.ClientSession() as session:
            async with session.get(endpoint_to_fetch_user_info) as response:
                body = await response.text()

            if self._is_token_good(body):
                access_token = parse_qs(body)["access_token"][0]
            else:
                raise HTTPException(status_code=400, detail="bad code")

        async with aiohttp.ClientSession(headers={"Authorization": "Bearer " + access_token}) as session:
            async with session.get(self.URL_USERINFO) as response:
                user_data: dict = await response.json()

        return user_data, access_token

    def _get_github_tokeninfo_endpoint(self, code: str) -> str:
        auth_client_params = settings.github_auth_client_info
        auth_client_params.update({"code": code})
        return f"{self.URL_TOKENINFO}?{urlencode(auth_client_params)}"

    def _is_token_good(self, body: str) -> bool:
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

        return success_indicator in body


class GoogleOAuth2(auth_type.OAuth2):
    PROVIDER_NAME = "google"
    flow.redirect_uri = settings.auth.redirect_uri
    URL_TOKENINFO = "https://www.googleapis.com/oauth2/v3/tokeninfo?access_token="
    URL_UPDATE_TOKEN = "https://oauth2.googleapis.com/token"

    async def validate_token(self, db: Session, token: str) -> User:
        try:
            data = await self._fetch_user_info_by_access_token(access_token=token)

            self._validate_aud(data["aud"])
            self._validate_email(data["email"], db)
            user: database.models.GoogleUser = crud.get_user_by_sub(db, data["sub"])
            # user = crud.update_user(db, user.id, **data)

        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))

        return User(
            id=user.user_id,
            outer_id=user.sub,
            email=user.email,
            picture=user.picture,
            name=user.given_name or user.fullname,
        )

    async def logout(self, db: Session, token: str):
        crud.set_users_refresh_token_invalid(db, token)

    async def exchange_authcode(self, db: Session, auth_code: str):
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
            general_user = crud.get_general_user_by_outer_id(db, user_info["sub"], self.PROVIDER_NAME)
        else:
            general_user = crud.add_user(
                db=db,
                provider_name=self.PROVIDER_NAME,
                outer_id=user_info["sub"],
            )
            crud.add_google_user(db, UserCreate(**user_info), general_user.id)

        expire_date = datetime.now() + timedelta(days=settings.auth.refresh_token_lifetime_days)

        user_valid = UserValidScheme(
            user_id=general_user.id, refresh_token=refresh_token, is_valid=True, expire_date=expire_date
        )
        crud.add_user_to_uservalid(db, user_valid)
        return UserToken(**User.from_orm(general_user).__dict__, token=access_token, refresh_token=refresh_token)

    async def update_access_token(self, db: Session, refresh_token: str) -> dict[str, str]:
        user: GoogleUserValid = crud.get_uservalid_by_refresh_token(db, refresh_token)

        if not user:
            raise HTTPException(status_code=401, detail="User is not authenticated!")

        if not self._validate_date(user.expire_date):
            # redirect?
            raise HTTPException(status_code=401, detail="Refresh token has expired!")

        info = settings.auth_client_info.copy()
        info.update(
            {
                "grant_type": "refresh_token",
                "refresh_token": refresh_token,
            }
        )

        async with aiohttp.ClientSession() as session:
            async with session.get(self.URL_TOKENINFO, data=info) as resp:
                response = await resp.json()
                resp_status = resp.status
        if resp_status != 200:
            raise ValueError(f"Google token is bad. Response: {response}, status_code: {resp_status}")

        access_token = response["access_token"]
        return {"token": access_token}

    ########################################################################

    async def _fetch_user_info_by_access_token(self, access_token: str) -> dict[str, str]:
        """
        Fetches user_info using access token by request to Google API
        Checks if access token is valid by date.
        """
        async with aiohttp.ClientSession() as session:
            async with session.post(self.URL_TOKENINFO + access_token) as resp:
                response = await resp.json()
                resp_status = resp.status

        if resp_status != 200:
            raise ValueError(f"Access token has expired or token is bad. Response: {response}")

        return response

    @staticmethod
    def _validate_aud(input_aud: str) -> None:
        base = settings.auth.google_client_id

        if input_aud != base:
            raise ValueError("Audience is not valid!")

    @staticmethod
    def _validate_email(email: str, db: Session) -> None:
        if not crud.check_google_user_exists(db, email):
            raise ValueError("User is not listed in the database")

    @staticmethod
    def _validate_date(expire_data: datetime):
        if datetime.now() > expire_data:
            raise ValueError("Token has expired")
