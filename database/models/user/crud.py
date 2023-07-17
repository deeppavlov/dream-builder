from database.models import providers
from database.models.user.model import GeneralUser
from sqlalchemy import String, cast, select
from sqlalchemy.orm import Session


def add_user(
    db: Session,
    provider_name: str,
    outer_id: str,
) -> GeneralUser:
    provider_id = providers.crud.get_provider_id_by_name(db, provider_name)
    user = GeneralUser(
        provider_id=provider_id,
        outer_id=outer_id,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def get_general_user_by_outer_id(db: Session, outer_id: str, provider_name: str) -> GeneralUser:
    provider_id = providers.crud.get_provider_id_by_name(db, provider_name)
    gu = GeneralUser
    return db.query(gu).where(gu.provider_id == provider_id, gu.outer_id == cast(outer_id, String)).first()


def get_all(db: Session) -> [GeneralUser]:
    return db.scalars(select(GeneralUser)).all()


def get_by_id(db: Session, id: int) -> GeneralUser:
    return db.query(GeneralUser).where(GeneralUser.id == id).first()
