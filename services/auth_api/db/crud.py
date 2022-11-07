from sqlalchemy.orm import Session
from db import models
from db.db_models import User
from security.password_utils import hash_password


def get_user_by_id(db: Session, user_id: int) -> models.UserInDB:
    return db.query(User).filter(User.id == user_id).first()


def get_user_by_email(db: Session, email: str) -> models.UserInDB:
    return db.query(User).filter(User.email == email).first()


def get_user_by_username(db: Session, username: str) -> models.UserInDB:
    return db.query(User).filter(User.username == username).first()


def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(User).offset(skip).limit(limit).all()


def create_user(db: Session, user: models.UserCreate):
    hashed_password = hash_password(user.password)
    db_user = User(email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)  # if contains any new data from the database, like the generated ID
    return db_user
