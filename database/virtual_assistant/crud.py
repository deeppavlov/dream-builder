from sqlalchemy.orm import Session

from database.component.model import Component
from database.virtual_assistant.model import VirtualAssistant
from datetime import datetime
from typing import Optional, List

from sqlalchemy import select, update, and_, delete, func
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.orm import Session

from database import models, enums, crud
from database.component import crud as component_crud


def get_by_id(db: Session, id: int):
    return db.get(VirtualAssistant, id)


def get_by_name(db: Session, name: str) -> Optional[VirtualAssistant]:
    virtual_assistant = db.scalar(select(VirtualAssistant).filter_by(name=name))

    if not virtual_assistant:
        raise ValueError(f"Virtual assistant {name} does not exist")

    return virtual_assistant


def get_all(db: Session) -> [VirtualAssistant]:
    return db.scalars(select(VirtualAssistant)).all()


def get_all_public_templates(db: Session) -> [VirtualAssistant]:
    return db.scalars(
        select(VirtualAssistant).where(
            and_(
                VirtualAssistant.publish_request.has(
                    public_visibility=enums.VirtualAssistantPublicVisibility.PUBLIC_TEMPLATE
                ),
                VirtualAssistant.publish_request.has(state=enums.PublishRequestState.APPROVED),
            )
        )
    ).all()


def get_all_by_author(db: Session, user_id: int) -> [VirtualAssistant]:
    return db.scalars(select(VirtualAssistant).where(VirtualAssistant.author_id == user_id)).all()


def create(
    db: Session,
    author_id: int,
    source: str,
    name: str,
    display_name: str,
    description: str,
    components: List[Component],
    cloned_from_id: Optional[int] = None,
) -> VirtualAssistant:
    new_virtual_assistant = db.scalar(
        insert(VirtualAssistant)
        .values(
            cloned_from_id=cloned_from_id,
            author_id=author_id,
            source=source,
            name=name,
            display_name=display_name,
            description=description,
        )
        .returning(VirtualAssistant)
    )

    # if cloned_from_id:
    #     original_components = get_components(db, cloned_from_id)

    crud.create_virtual_assistant_components(db, new_virtual_assistant.id, components)

    return new_virtual_assistant


def update_by_name(db: Session, name: str, **kwargs):
    return db.scalar(
        update(VirtualAssistant)
        .where(VirtualAssistant.name == name)
        .values(**kwargs)
        .returning(VirtualAssistant)
    )


def update_metadata_by_name(db: Session, name: str, **kwargs) -> VirtualAssistant:
    values = {k: v for k, v in kwargs.items() if v is not None}

    return db.scalar(
        update(VirtualAssistant)
        .where(VirtualAssistant.name == name)
        .values(**values)
        .returning(VirtualAssistant)
    )


def delete_by_name(db: Session, name: str) -> None:
    db.execute(delete(VirtualAssistant).where(VirtualAssistant.name == name))
