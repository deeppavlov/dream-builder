from sqlalchemy.orm import Session

from database.virtual_assistant.model import VirtualAssistant
from datetime import datetime
from typing import Optional, List

from sqlalchemy import select, update, and_, delete, func
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.orm import Session

from database import models, enums


def get_by_id(db: Session, id: int):
    return db.get(VirtualAssistant, id)


def get_by_name(db: Session, name: str) -> Optional[models.VirtualAssistant]:
    virtual_assistant = db.scalar(select(models.VirtualAssistant).filter_by(name=name))

    if not virtual_assistant:
        raise ValueError(f"Virtual assistant {name} does not exist")

    return virtual_assistant


def get_all(db: Session) -> [models.VirtualAssistant]:
    return db.scalars(select(models.VirtualAssistant)).all()


def get_all_public_templates(db: Session) -> [models.VirtualAssistant]:
    return db.scalars(
        select(models.VirtualAssistant).where(
            and_(
                models.VirtualAssistant.publish_request.has(
                    public_visibility=enums.VirtualAssistantPublicVisibility.PUBLIC_TEMPLATE
                ),
                models.VirtualAssistant.publish_request.has(state=enums.PublishRequestState.APPROVED),
            )
        )
    ).all()


def get_all_by_author(db: Session, user_id: int) -> [models.VirtualAssistant]:
    return db.scalars(select(models.VirtualAssistant).where(models.VirtualAssistant.author_id == user_id)).all()


def create(
    db: Session,
    author_id: int,
    source: str,
    name: str,
    display_name: str,
    description: str,
    components: List[models.Component],
    cloned_from_id: Optional[int] = None,
) -> models.VirtualAssistant:
    new_virtual_assistant = db.scalar(
        insert(models.VirtualAssistant)
        .values(
            cloned_from_id=cloned_from_id,
            author_id=author_id,
            source=source,
            name=name,
            display_name=display_name,
            description=description,
        )
        .returning(models.VirtualAssistant)
    )

    # if cloned_from_id:
    #     original_components = get_components(db, cloned_from_id)

    crud.create_components(db, new_virtual_assistant.id, components)

    return new_virtual_assistant


def update_by_name(db: Session, name: str, **kwargs):
    return db.scalar(
        update(models.VirtualAssistant)
        .where(models.VirtualAssistant.name == name)
        .values(**kwargs)
        .returning(models.VirtualAssistant)
    )


def update_metadata_by_name(db: Session, name: str, **kwargs) -> models.VirtualAssistant:
    values = {k: v for k, v in kwargs.items() if v is not None}

    return db.scalar(
        update(models.VirtualAssistant)
        .where(models.VirtualAssistant.name == name)
        .values(**values)
        .returning(models.VirtualAssistant)
    )


def delete_by_name(db: Session, name: str) -> None:
    db.execute(delete(models.VirtualAssistant).where(models.VirtualAssistant.name == name))
