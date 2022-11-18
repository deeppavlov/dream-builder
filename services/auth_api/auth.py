from datetime import datetime

from fastapi import APIRouter, Depends, Header, HTTPException, Response, status
from google.auth import jwt
from sqlalchemy.orm import Session

import db.crud as crud
from config import config
from db.db import Base, engine, get_db
from models import UserCreate

router = APIRouter(prefix="/auth")

Base.metadata.create_all(bind=engine)


@router.get("/token", status_code=200)
async def validate_jwt(response: Response, jwt_data: str = Header(default=None), db: Session = Depends(get_db)):
    """
    Decode input jwt-token, validate date, check user in db and sign him up in case of user is not in db
    """
    try:
        data = jwt.decode(jwt_data, verify=False)

        # noinspection PyTypeChecker
        _check_date_is_valid(data["nbf"], data["exp"])  # nbf and exp fields are int
        _check_aud_is_valid(data["aud"])
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    user = UserCreate(**data)

    if not crud.check_user_exists(db, user.email):
        crud.add_google_user(db, user)
        response.status_code = status.HTTP_201_CREATED


def _check_aud_is_valid(input_aud: str) -> None:
    base = config["security"]["aud"]

    if input_aud != base:
        raise ValueError("Audience is not valid! ")


def _check_date_is_valid(nbf: int, exp: int) -> None:
    nbf = datetime.fromtimestamp(nbf)
    exp = datetime.fromtimestamp(exp)
    now = datetime.now()

    if now < nbf or now > exp:
        raise ValueError("Date of token is not valid!")
