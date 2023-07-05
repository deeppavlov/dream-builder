from sqlalchemy import select
from sqlalchemy.orm import Session

from database.models.api_key.model import ApiKey


def get_by_id(db: Session, id: int):
    return db.get(ApiKey, id)


def get_all(db: Session) -> [ApiKey]:
    return db.scalars(select(ApiKey)).all()
