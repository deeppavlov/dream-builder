from typing import Optional

from sqlalchemy import select, update, delete, func
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.orm import Session

from database.component.model import Component


def get_by_id(db: Session, component_id: int) -> Optional[Component]:
    return db.get(Component, component_id)


def get_all(db: Session) -> [Component]:
    return db.scalars(select(Component)).all()


def get_by_group_name(db: Session, group: str, component_type: str = None, author_id: int = None) -> [Component]:
    filters = {"group": group}
    if component_type:
        filters["component_type"] = component_type
    if author_id:
        filters["author_id"] = author_id

    return db.scalars(select(Component).filter_by(**filters)).all()


def create(
    db: Session,
    service_id: int,
    source: str,
    name: str,
    display_name: str,
    component_type: str,
    is_customizable: bool,
    author_id: int,
    ram_usage: str,
    group: str,
    endpoint: str,
    model_type: Optional[str] = None,
    gpu_usage: Optional[str] = None,
    description: Optional[str] = None,
    prompt: Optional[str] = None,
    prompt_goals: Optional[str] = None,
    lm_service_id: Optional[int] = None,
    lm_config: Optional[dict] = None,
    # build_args: Optional[dict] = None,
    # compose_override: Optional[dict] = None,
    # compose_dev: Optional[dict] = None,
    # compose_proxy: Optional[dict] = None,
) -> Component:
    component = db.scalar(
        insert(Component)
        .values(
            service_id=service_id,
            source=source,
            name=name,
            display_name=display_name,
            # container_name=container_name,
            component_type=component_type,
            model_type=model_type,
            is_customizable=is_customizable,
            author_id=author_id,
            description=description,
            ram_usage=ram_usage,
            gpu_usage=gpu_usage,
            # port=port,
            group=group,
            endpoint=endpoint,
            prompt=prompt,
            prompt_goals=prompt_goals,
            lm_service_id=lm_service_id,
            lm_config=lm_config,
            # build_args=build_args,
            # compose_override=compose_override,
            # compose_dev=compose_dev,
            # compose_proxy=compose_proxy,
        )
        .on_conflict_do_nothing(index_elements=[Component.source])
        .returning(Component)
    )
    if not component:
        component = db.scalar(select(Component).filter_by(source=source))

    return component


def update_by_id(db: Session, id: int, **kwargs) -> Component:
    values = {k: v for k, v in kwargs.items() if v is not None}

    return db.scalar(update(Component).filter_by(id=id).values(**values).returning(Component))


def delete_by_id(db: Session, id: int):
    db.execute(delete(Component).filter(Component.id == id))


def get_next_available_port(db: Session, range_min: int = 8000, range_max: int = 8199):
    last_used_component_port = db.scalar(
        select(func.max(Component.port)).where(Component.port.between(range_min, range_max))
    )
    return last_used_component_port + 1
