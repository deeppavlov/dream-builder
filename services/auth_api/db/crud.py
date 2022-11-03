from sqlalchemy.orm import Session
from db import db_models
from security.password_utils import hash_password


def get_user_by_id(db: Session, user_id: int) -> db_models.UserInDB:
    return db.query(db_models.User).filter(db_models.User.id == user_id).first()


def get_user_by_email(db: Session, email: str) -> db_models.UserInDB:
    return db.query(db_models.User).filter(db_models.User.email == email).first()


def get_user_by_username(db: Session, username: str) -> db_models.UserInDB:
    return db.query(db_models.User).filter(db_models.User.username == username).first()


def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(db_models.User).offset(skip).limit(limit).all()


def create_user(db: Session, user: db_models.UserCreate):
    hashed_password = hash_password(user.password)
    db_user = db_models.UserInDB(email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)  # if contains any new data from the database, like the generated ID
    return db_user
