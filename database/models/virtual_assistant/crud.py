from typing import Optional, List

from sqlalchemy import select, update, and_, delete, func
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.orm import Session

from database import enums
from database.models import Deployment
from database.models.component.model import Component
from database.models.virtual_assistant.model import VirtualAssistant
from database.models.virtual_assistant_component import crud as virtual_assistant_component_crud


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
                VirtualAssistant.is_visible,
                VirtualAssistant.publish_request.has(
                    public_visibility=enums.VirtualAssistantPublicVisibility.PUBLIC_TEMPLATE
                ),
                VirtualAssistant.publish_request.has(state=enums.PublishRequestState.APPROVED),
            )
        )
    ).all()


def get_all_by_author(db: Session, user_id: int) -> [VirtualAssistant]:
    return db.scalars(
        select(VirtualAssistant).where(and_(VirtualAssistant.is_visible, VirtualAssistant.author_id == user_id))
    ).all()


def get_virtual_assistant_dist_name(db:Session, parent_assistant_id: int) -> str:
    virtual_assistant = db.query(VirtualAssistant).filter(VirtualAssistant.id == parent_assistant_id).first()

    if not virtual_assistant:
        raise ValueError(f"Virtual assistant with id = {parent_assistant_id} does not exist")

    return virtual_assistant.name

  
def create(
    db: Session,
    author_id: int,
    source: str,
    name: str,
    display_name: str,
    description: str,
    components: List[Component],
    language_id: int,
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
            language_id=language_id,
        )
        .returning(VirtualAssistant)
    )

    # if cloned_from_id:
    #     original_components = get_components(db, cloned_from_id)

    virtual_assistant_component_crud.create_many(db, new_virtual_assistant.id, components)

    return new_virtual_assistant


def update_by_name(db: Session, name: str, **kwargs):
    return db.scalar(
        update(VirtualAssistant).where(VirtualAssistant.name == name).values(**kwargs).returning(VirtualAssistant)
    )


def update_metadata_by_name(db: Session, name: str, **kwargs) -> VirtualAssistant:
    values = {k: v for k, v in kwargs.items() if v is not None}

    return db.scalar(
        update(VirtualAssistant).where(VirtualAssistant.name == name).values(**values).returning(VirtualAssistant)
    )


def delete_by_name(db: Session, name: str) -> None:
    db.execute(delete(VirtualAssistant).where(VirtualAssistant.name == name))


def count_active_user_deployments(user_id: int, session: Session) -> int:
    return session.query(func.count(VirtualAssistant.id)).join(Deployment).filter(
        VirtualAssistant.author_id == user_id,
        Deployment.state == 'UP'
    ).scalar()
