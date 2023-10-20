from typing import Optional

from database.models import google_user
from database.models.google_uservalid.model import GoogleUserValid
from sqlalchemy.orm import Session


def add_user(db: Session, user) -> Optional[GoogleUserValid]:
    db_user = GoogleUserValid(**user.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def set_token_invalid(db: Session, refresh_token: str) -> None:
    db.query(GoogleUserValid).filter(GoogleUserValid.refresh_token == refresh_token).update({"is_valid": False})
    db.commit()


def get_by_email(db: Session, email: str) -> Optional[GoogleUserValid]:
    user = google_user.crud.get_by_email(db, email)
    if not user:
        return None
    user_id = user.id
    return (
        db.query(GoogleUserValid).filter(GoogleUserValid.user_id == user_id, GoogleUserValid.is_valid == True).first()
    )


def get_by_refresh_token(db: Session, refresh_token: str) -> GoogleUserValid:
    return (
        db.query(GoogleUserValid)
        .filter(GoogleUserValid.refresh_token == refresh_token, GoogleUserValid.is_valid == True)
        .first()
    )


def check_user_exists(db: Session, email) -> bool:
    user = google_user.crud.get_by_email(db, email)
    if user and db.query(GoogleUserValid).filter(GoogleUserValid.id == user.id).first():
        return True
    return False


def update_users_refresh_token(db: Session, user, email: str) -> None:
    user_id = google_user.crud.get_by_email(db, email).id
    db.query(GoogleUserValid).filter(GoogleUserValid.id == user_id).update(
        {"refresh_token": user.refresh_token, "expire_date": user.expire_date}
    )
    db.commit()
