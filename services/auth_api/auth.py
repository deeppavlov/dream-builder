import logging
from datetime import datetime

from fastapi import APIRouter, Depends, Header, HTTPException, status
from google.auth import jwt
from sqlalchemy.orm import Session

import services.auth_api.db.crud as crud
from services.auth_api.config import settings
from services.auth_api.db.db import init_db
from services.auth_api.models import UserCreate, User, UserValidScheme

logging.basicConfig(format="%(asctime)s - %(name)s - %(levelname)s - %(message)s", level=logging.DEBUG)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth")

SessionLocal = init_db(settings.db.user, settings.db.password, settings.db.host, settings.db.port, settings.db.name)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/token", status_code=status.HTTP_200_OK)
async def validate_jwt(token: str = Header()) -> None:
    """
    Decode input jwt-token, validate date, check user in db or otherwise sign them up
    """
    logger.info(token)

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
    base = settings.auth.google_client_id

    if input_aud != base:
        raise ValueError("Audience is not valid! ")


def validate_date(nbf: int, exp: int) -> None:
    nbf = datetime.fromtimestamp(nbf)
    exp = datetime.fromtimestamp(exp)
    now = datetime.now()

    if now < nbf or now > exp:
        raise ValueError("Date of token is not valid!")


@router.get("/login", status_code=status.HTTP_200_OK, dependencies=[Depends(validate_jwt)])
async def login(token: str = Header(), db: Session = Depends(get_db)):
    logger.info(token)

    data = jwt.decode(token, verify=False)
    user = crud.get_or_create_user(db, UserCreate(**data))

    user_valid = UserValidScheme(email=data["email"], token=token, is_valid=True)
    crud.add_user_to_uservalid(db, user_valid, data["email"])

    return User(
        email=user.email,
        sub=user.sub,
        picture=user.picture,
        name=user.fullname,
        given_name=user.given_name,
        family_name=user.family_name,
    )


@router.put("/logout", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(validate_jwt)])
async def logout(token: str = Header(), db: Session = Depends(get_db)):
    logger.info(token)

    data = jwt.decode(token, verify=False)
    crud.set_users_token_invalid(db, data["email"])
