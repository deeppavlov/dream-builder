from typing import Optional

from sqlalchemy import select
from sqlalchemy.orm import Session

from database.models import Language


def get_all_languages(db: Session) -> [Language]:
    return db.scalars(select(Language)).all()


def get_language_by_id(db: Session, id: int) -> Optional[Language]:
    return db.get(Language, id)


def get_language_by_value(db: Session, value: str) -> Optional[Language]:
    return db.scalar(select(Language).filter_by(value=value))
