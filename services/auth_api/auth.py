from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from fastapi.templating import Jinja2Templates
from fastapi import Request
from pathlib import Path
from google.oauth2 import id_token
from google.auth.transport import requests

import db.crud as crud
from db.db import Base, SessionLocal, engine, get_db
from models import User, UserCreate, UserInDB, UserCreateForm
from security import password_utils
from security.security import ACCESS_TOKEN_EXPIRE_MINUTES, ALGORITHM, SECRET_KEY
from security.tokens import Token, TokenData, create_access_token
from config import config

router = APIRouter(prefix="/auth")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
Base.metadata.create_all(bind=engine)

templates = Jinja2Templates(directory=str(Path(__file__).absolute().with_name("templates")))


def authenticate_user(username: str, password: str):
    db = SessionLocal()
    user = crud.get_user_by_email(db, email=username)
    db.close()
    if not user:
        return False
    if not password_utils.verify_password(password, user.hashed_password):
        return False

    return user


@router.get("")
async def auth_home(request: Request):
    return templates.TemplateResponse("auth.html", {"request": request})


@router.post("/users/", response_model=User)
async def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)

    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    return crud.create_user(db=db, user=user)


@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": user.email}, expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}


# async def get_current_user(token: str = Depends(oauth2_scheme)):
#     credentials_exception = HTTPException(
#         status_code=status.HTTP_401_UNAUTHORIZED,
#         detail="Could not validate credentials",
#         headers={"WWW-Authenticate": "Bearer"},
#     )
#     try:
#         payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
#         username: str = payload.get("sub")
#         if username is None:
#             raise credentials_exception
#         token_data = TokenData(username=username)
#     except JWTError:
#         raise credentials_exception
#     user = crud.get_user_by_username(get_db(), username=token_data.username)
#     if user is None:
#         raise credentials_exception
#     return user


async def google_auth(user: UserCreateForm, db: Session = Depends(get_db)):
    try:
        idinfo = id_token.verify_oauth2_token(user.token, requests.Request(), config["GOOGLE_CLIENT_ID"])
    except ValueError:
        raise HTTPException(403, "Bad code")

    if not crud.check_user_email_exists(db, user.email):
        user = crud.create_user(db, user)  # todo: to acknowledge required fields for google-auth db

    internal_token = create_access_token(**user)
    return user.id, internal_token.get("access_token")
