from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException
from google.auth import jwt

import db.crud as crud
from db.db import Base, engine, get_db
from models import UserCreate

router = APIRouter(prefix="/auth")

Base.metadata.create_all(bind=engine)


@router.get("/auth")
async def validate_jwt(jwt_data: str, db: Session = Depends(get_db)):
    data = jwt.decode(jwt_data, verify=False)

    user = UserCreate(**data)
    if crud.check_user_exists(db, user):
        return HTTPException(detail="User in database", status_code=401)
    else:
        crud.add_google_user(db, user)
