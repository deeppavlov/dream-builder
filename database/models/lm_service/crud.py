from typing import Optional

from sqlalchemy import select
from sqlalchemy.orm import Session

from database.models import LmServiceLanguage
from database.models.lm_service.model import LmService
from database.models.language import crud as language_crud


def get_all_lm_services(db: Session, language: str = None, hosted_only: bool = True) -> [LmService]:
    # filter_kwargs = {}
    # if hosted_only:
    #     filter_kwargs["is_hosted"] = True
    # if language:
    #     language = language_crud.get_language_by_value(db, language)
    #     filter_kwargs["languages"] = LmService.languages.any(language)

    filters = []
    if hosted_only:
        filters.append(LmService.is_hosted == True)
    if language:
        filters.append(LmService.languages.any(LmServiceLanguage.language.has(value=language)))

    return db.scalars(select(LmService).filter(*filters)).all()


def get_lm_service(db: Session, id: int) -> Optional[LmService]:
    return db.get(LmService, id)


def get_lm_service_by_name(db: Session, name: str) -> Optional[LmService]:
    return db.scalar(select(LmService).filter_by(name=name))
