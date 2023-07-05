from typing import Optional

from sqlalchemy.orm import Session

from database.user import crud as user_crud
from database.uservalid.model import UserValid


def add_user_to_uservalid(db: Session, user, email: str) -> Optional[UserValid]:
    db_user = UserValid(**user.dict(), user_id=user_crud.get_by_email(db, email).id)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def set_users_refresh_token_invalid(db: Session, refresh_token: str) -> None:
    db.query(UserValid).filter(UserValid.refresh_token == refresh_token).update({"is_valid": False})
    db.commit()


def get_uservalid_by_email(db: Session, email: str) -> Optional[UserValid]:
    user = user_crud.get_by_email(db, email)
    if not user:
        return None
    user_id = user.id
    return db.query(UserValid).filter(UserValid.user_id == user_id, UserValid.is_valid == True).first()


def get_uservalid_by_refresh_token(db: Session, refresh_token: str) -> UserValid:
    return db.query(UserValid).filter(UserValid.refresh_token == refresh_token, UserValid.is_valid == True).first()


def check_uservalid_exists(db: Session, email) -> bool:
    user = user_crud.get_by_email(db, email)
    if user and db.query(UserValid).filter(UserValid.id == user.id).first():
        return True
    return False


def update_users_refresh_token(db: Session, user, email: str):
    user_id = user_crud.get_by_email(db, email).id
    db.query(UserValid).filter(UserValid.id == user_id).update(
        {"refresh_token": user.refresh_token, "expire_date": user.expire_date}
    )
    db.commit()
