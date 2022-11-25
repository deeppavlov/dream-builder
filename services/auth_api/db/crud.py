from sqlalchemy.orm import Session

import models
from db.db_models import GoogleUser


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
