from datetime import datetime, timedelta

import aiohttp
from fastapi import APIRouter, Depends, Header, HTTPException, status
from google.auth import jwt
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
from sqlalchemy.orm import Session
import google.auth.transport.requests as Request

import services.auth_api.db.crud as crud
from services.auth_api.db.db import init_db
from services.auth_api.db.db_models import UserValid
from services.auth_api.const import GOOGLE_SCOPE, CLIENT_INFO
from services.auth_api.config import settings
from services.auth_api.models import UserCreate, User, UserValidScheme

router = APIRouter(prefix="/auth")

SessionLocal = init_db(settings.db.user, settings.db.password, settings.db.host, settings.db.port, settings.db.name)

flow = Flow.from_client_secrets_file(client_secrets_file="client_secret.json", scopes=GOOGLE_SCOPE)
flow.redirect_uri = "http://localhost:5173"


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/token", status_code=status.HTTP_200_OK)
async def validate_jwt(token: str = Header()):
    """
    This endpoint is used to decode and validate a JWT token passed in the Authorization header of the request.
    The token is decoded and checked for its 'nbf' and 'exp' fields to ensure it is within its valid date range.
    The 'aud' field is also checked to ensure it matches the expected audience.
    If the token is invalid or expired, a HTTP 400 Bad Request error is returned.
    TODO: add check if user in db otherwise http exception
    TODO: replace jwt-token by access_token
    """
    if token == settings.auth.test_token:
        return
    try:
        data = jwt.decode(token, verify=False)

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


@router.get("/login")
async def save_user(token: str, db: Session = Depends(get_db)):
    """
    TODO: endpoint -> method due to no usage from frontend
    """
    # async with aiohttp.ClientSession() as session:
    #     async with session.get(f"https://www.googleapis.com/oauth2/v3/tokeninfo?access_token={token}") as response:
    #         data = await response.json()
    data = token
    data = jwt.decode(data, verify=False)
    print(data)
    if not crud.check_user_exists(db, data["email"]):
        user = UserCreate(**data)
        crud.add_google_user(db, user)
        return User(**data)

    return User(**crud.get_user_by_email(db, data["email"]))


@router.put("/logout", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(validate_jwt)])
async def logout(token: str = Header(), db: Session = Depends(get_db)) -> None:
    """
    TODO: logout will remove record out of a db
    """
    data = jwt.decode(token, verify=False)

    crud.set_users_refresh_token_invalid(db, data["email"])


@router.get("/exchange_authcode")
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
    print(user_info)
    # await save_user(jwt_data, db)

    expire_time = datetime.now() + timedelta(days=settings.auth.refresh_token_lifetime_days)
    user_valid = UserValidScheme(token=refresh_token, is_valid=True, expire_time=expire_time)
    # crud.add_user_to_uservalid(db, user_valid, user_info["email"])

    return {"token": access_token}


@router.post("/update_token")
async def update_access_token(refresh_token: str, db: Session = Depends(get_db)) -> dict[str, str]:

    # if not crud.check_user_exists(db, email):
    #     raise HTTPException(status_code=401, detail="User is not authenticated!")

    # user: UserValid = crud.get_uservalid_by_email(db, email)
    # refresh_token = user.refresh_token

    # if not _check_refresh_token_validity(user.expire_date):
    #     redirect?
        # raise HTTPException(status_code=401, detail="Refresh token has expired!")

    info = CLIENT_INFO.copy()
    info.update({"refresh_token": refresh_token})
    creds = Credentials.from_authorized_user_info(info=info, scopes=GOOGLE_SCOPE)
    creds.refresh(Request.Request())
    access_token = creds.token
    return {"token": access_token}


def _check_refresh_token_validity(expire_date: datetime) -> bool:
    if datetime.now() > expire_date:
        return False

    return True
