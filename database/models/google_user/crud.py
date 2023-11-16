from typing import Optional

from database.models.google_user.model import GoogleUser
from sqlalchemy import select, update
from sqlalchemy.orm import Session


def get_all(db: Session) -> [GoogleUser]:
    return db.scalars(select(GoogleUser)).all()


def check_user_exists(db: Session, outer_id) -> bool:
    if db.query(GoogleUser).filter(GoogleUser.sub == outer_id).first():
        return True
    return False


def add_google_user(db: Session, user, user_id) -> GoogleUser:
    db_user = GoogleUser(
        user_id=user_id,
        email=user.email,
        sub=user.sub,
        picture=user.picture,
        fullname=user.name,
        given_name=user.given_name,
        family_name=user.family_name,
        role_id=1,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_by_id(db: Session, user_id: int) -> Optional[GoogleUser]:
    return db.get(GoogleUser, user_id)


def get_by_outer_id(db: Session, sub: str) -> GoogleUser:
    return db.scalar(select(GoogleUser).filter_by(sub=sub))


def get_by_email(db: Session, email: str) -> GoogleUser:
    return db.scalar(select(GoogleUser).filter_by(email=email))


def get_by_role(db: Session, role_id: int) -> [GoogleUser]:
    return db.scalars(select(GoogleUser).filter_by(role_id=role_id)).all()


def update_by_id(db: Session, user_id: int, **kwargs) -> GoogleUser:
    if name := kwargs.get("name"):
        kwargs["fullname"] = name

    kwargs = {k: v for k, v in kwargs.items() if k in GoogleUser.__table__.columns.keys()}

    user = db.scalar(update(GoogleUser).filter_by(user_id=user_id).values(**kwargs).returning(GoogleUser))
    if not user:
        raise ValueError(f"GoogleUser with id={user_id} does not exist")

    return user
