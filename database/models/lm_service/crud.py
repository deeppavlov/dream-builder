from typing import Optional

from sqlalchemy import select
from sqlalchemy.orm import Session

from database.models.lm_service.model import LmService


def get_all_lm_services(db: Session, hosted_only: bool = True) -> [LmService]:
    filter_kwargs = {}
    if hosted_only:
        filter_kwargs["is_hosted"] = True

    return db.scalars(select(LmService).filter_by(**filter_kwargs)).all()


def get_lm_service(db: Session, id: int) -> Optional[LmService]:
    return db.get(LmService, id)


def get_lm_service_by_name(db: Session, name: str) -> Optional[LmService]:
    return db.scalar(select(LmService).filter_by(name=name))
