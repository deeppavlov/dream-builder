from typing import Optional

from sqlalchemy import select, update
from sqlalchemy.orm import Session

from database.models.user.model import GoogleUser


def get_all(db: Session) -> [GoogleUser]:
    return db.scalars(select(GoogleUser)).all()


def check_user_exists(db: Session, email) -> bool:
    if db.query(GoogleUser).filter(GoogleUser.email == email).first():
        return True
    return False


def add_google_user(db: Session, user) -> GoogleUser:
    db_user = GoogleUser(
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


def get_by_sub(db: Session, sub: str) -> GoogleUser:
    return db.scalar(select(GoogleUser).filter_by(sub=sub))


def get_by_email(db: Session, email: str) -> GoogleUser:
    return db.scalar(select(GoogleUser).filter_by(email=email))


def get_by_role(db: Session, role_id: int) -> [GoogleUser]:
    return db.scalars(select(GoogleUser).filter_by(role_id=role_id)).all()


def update_by_id(db: Session, id: int, **kwargs) -> GoogleUser:
    kwargs = {k: v for k, v in kwargs.items() if k in GoogleUser.__table__.columns.keys()}

    user = db.scalar(update(GoogleUser).filter_by(id=id).values(**kwargs).returning(GoogleUser))
    if not user:
        raise ValueError(f"GoogleUser with id={id} does not exist")

    return user
