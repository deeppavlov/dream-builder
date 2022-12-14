from datetime import datetime

from fastapi import APIRouter, Depends, Header, HTTPException, Response, status
from google.auth import jwt
from sqlalchemy.orm import Session

import services.auth_api.db.crud as crud
from services.auth_api.config import settings
from services.auth_api.db.db import init_db
from services.auth_api.models import UserCreate

router = APIRouter(prefix="/auth")

SessionLocal = init_db(settings.db.user, settings.db.password, settings.db.host, settings.db.port, settings.db.name)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/token", status_code=200)
async def validate_jwt(jwt_data: str = Header(), db: Session = Depends(get_db)):
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

    user = UserCreate(**data)

    if not crud.check_user_exists(db, user.email):
        crud.add_google_user(db, user)


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
