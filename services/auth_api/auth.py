from typing import Annotated

from fastapi import APIRouter, Depends, Header, status, HTTPException
from pydantic import EmailStr
from sqlalchemy.orm import Session

from database.core import init_db
from apiconfig.config import settings
from database.models import google_user
from database.user_ops import update_user_email
from services.shared.user import User
from services.auth_api import auth_type
from services.auth_api.auth_type import GithubAuth, GoogleOAuth2, Unauth
from services.auth_api.models import UserToken

router = APIRouter(prefix="/auth")
SessionLocal = init_db(settings.db.user, settings.db.password, settings.db.host, settings.db.port, settings.db.name)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


PROVIDERS: dict[str, auth_type.AuthProviders] = {
    "": GoogleOAuth2(),
    "google": GoogleOAuth2(),
    "github": GithubAuth(),
    "unauth": Unauth(),
}


@router.get("/token", status_code=status.HTTP_200_OK)
async def validate_jwt(
        token: str = Header(), auth_type: str = Header(default=""), db: Session = Depends(get_db)
) -> User:
    """
    `auth_type: Annotated[str | None, Header()] = None` means that auth_type header field is optional and may be None.

    Exchanges access token for user_info and validates it by aud, presence in userDB and expiration date or otherwise
    Check is carried out via `_fetch_user_info_by_access_token` function
    raise HTTPException with status_code == 400
    """
    if token == settings.auth.test_token:
        user: google_user.model = google_user.crud.get_by_outer_id(db, "106152631136730592791")
        name = user.fullname
        return User(id=user.user_id, outer_id=user.sub, email=user.email, picture=user.picture, name=name,
                    role=user.role)

    return await PROVIDERS[auth_type].validate_token(db, token)


@router.put("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(
        token: str = Header(), auth_type: str = Header(default=""), db: Session = Depends(get_db)
) -> None:
    """
    refresh_token -> token
    """
    return await PROVIDERS[auth_type].logout(db, token)


@router.post("/exchange_authcode")
async def exchange_authcode(
        auth_code: str = "", auth_type: str = Header(default=""), db: Session = Depends(get_db)
) -> UserToken:
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
    return await PROVIDERS[auth_type].exchange_authcode(db, auth_code)


@router.post("/update_token")
async def update_access_token(
        refresh_token: str, auth_type: auth_type.OAuth2ProviderNames = Header(default=""), db: Session = Depends(get_db)
) -> UserToken:
    return await PROVIDERS[auth_type].update_access_token(db, refresh_token)

# TEST ONLY
# @router.get("/github_auth")
# async def github_auth():
#     from fastapi.responses import RedirectResponse
#     return RedirectResponse(PROVIDERS["github"].GITHUB_AUTH_URL_WITH_PARAMS)


@router.post("/update_user/{id}")
async def update_user_info(
        user_id: int, new_email: EmailStr, token: str = Header(), auth_type: str = Header(default=""), db: Session = Depends(get_db),
):
    """
    At the moment, only changing the user's email is supported.
    """
    if token == settings.auth.test_token:
        raise HTTPException(status_code=400, detail=str("Can't change GodUser"))

    return update_user_email(db, user_id, auth_type, new_email)
