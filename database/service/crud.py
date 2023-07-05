from sqlalchemy import select
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.orm import Session

from database.service.model import Service


def get_or_create(db: Session, name: str, source: str):
    service = db.scalar(
        insert(Service)
        .values(name=name, source=source)
        .on_conflict_do_nothing(index_elements=[Service.source])
        .returning(Service)
    )
    if not service:
        service = db.scalar(select(Service).filter_by(source=source))

    return service
