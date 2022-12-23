from sqlalchemy.orm import Session

from services.auth_api import models
from services.auth_api.db.db_models import GoogleUser, UserValid


def check_user_exists(db: Session, email):
    if db.query(GoogleUser).filter(GoogleUser.email == email).first():
        return True
    return False


def get_or_create_user(db: Session, user: models.UserCreate):
    db_user = get_user_by_email(db, user.email)

    if not db_user:
        db_user = GoogleUser(
            email=user.email,
            sub=user.sub,
            picture=user.picture,
            fullname=user.name,
            given_name=user.given_name,
            family_name=user.family_name,
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)

    return db_user


def get_user_by_email(db: Session, email: str):
    return db.query(GoogleUser).filter(GoogleUser.email == email).first()


def add_user_to_uservalid(db: Session, user: models.UserValidScheme, email: str):
    db_user = UserValid(**user.dict(), user_id=get_user_by_email(db, email).id)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def set_users_token_invalid(db: Session, token: str):
    db.query(UserValid).filter(UserValid.token == token).update({"is_valid": False})
    db.commit()
