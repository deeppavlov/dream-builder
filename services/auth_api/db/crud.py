from sqlalchemy.orm import Session

from services.auth_api import models
from services.auth_api.db.db_models import GoogleUser, UserValid


def check_user_exists(db: Session, email):
    if db.query(GoogleUser).filter(GoogleUser.email == email).first():
        return True
    return False


def add_google_user(db: Session, user: models.UserCreate):
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
    return db.query(GoogleUser).filter(GoogleUser.c.email == email).first()


def add_user_to_uservalid(db: Session, user: models.UserValidScheme, email: str):
    db_user = UserValid(**user.dict(),
                        id=db.query(GoogleUser).filter(GoogleUser.c.email == email).first())

    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def set_users_token_invalid(db: Session, token: str):
    db.query(UserValid).filter(UserValid.token == token).update({"is_valid": False})
    db.commit()


def get_users_token_by_email(db: Session, email: str):
    user_id = get_user_by_email(db, email).id
    return db.query(UserValid).filter(UserValid.id == user_id).first().token
