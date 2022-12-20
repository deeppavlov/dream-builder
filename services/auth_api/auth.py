from datetime import datetime

from fastapi import APIRouter, Depends, Header, HTTPException, status
from google.auth import jwt
from sqlalchemy.orm import Session

import services.auth_api.db.crud as crud
from services.auth_api.config import settings
from services.auth_api.db.db import init_db
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
    crud.add_user_to_uservalid(db, user_valid)

    if not crud.check_user_exists(db, data["email"]):
        user = UserCreate(**data)
        crud.add_google_user(db, user)
        return User(**data)

    return User(**crud.get_user_by_email(db, data["email"]))


@router.put("/logout", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(validate_jwt)])
async def logout(jwt_data: str = Header(), db: Session = Depends(get_db)):
    data = jwt.decode(jwt_data, verify=False)
    crud.set_users_token_invalid(db, data["email"])
