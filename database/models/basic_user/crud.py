from typing import Optional

from database.models.basic_user.model import BasicUser
from sqlalchemy import select
from sqlalchemy.orm import Session


def get_all(db: Session) -> [BasicUser]:
    return db.scalars(select(BasicUser)).all()


def check_user_exists(db: Session, outer_id) -> bool:
    if db.query(BasicUser).filter(BasicUser.sub == outer_id).first():
        return True
    return False


def add_user(db: Session, email, token, user_id) -> BasicUser:
    db_user = BasicUser(
        user_id=user_id,
        email=email,
        token=token,
        role_id=1,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_by_id(db: Session, user_id: int) -> Optional[BasicUser]:
    return db.get(BasicUser, user_id)


def get_by_outer_id(db: Session, token: str) -> BasicUser:
    return db.scalar(select(BasicUser).filter_by(token=token))


def get_by_email(db: Session, email: str) -> BasicUser:
    return db.scalar(select(BasicUser).filter_by(email=email))


def get_by_role(db: Session, role_id: int) -> [BasicUser]:
    return db.scalars(select(BasicUser).filter_by(role_id=role_id)).all()
