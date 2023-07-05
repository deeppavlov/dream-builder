from database.deployment.model import Deployment

from sqlalchemy import select, update, delete
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.orm import Session

from database.deployment.model import Deployment
from database.virtual_assistant import crud as virtual_assistant_crud


def get_by_id(db: Session, id: int):
    return db.get(Deployment, id)


def get_all(db: Session, state: str = None) -> [Deployment]:
    select_stmt = select(Deployment)
    if state:
        select_stmt.filter_by(state=state)

    return db.scalars(select_stmt).all()


def get_by_virtual_assistant_name(db: Session, name: str) -> Deployment:
    virtual_assistant = virtual_assistant_crud.get_by_name(db, name)
    deployment = db.scalar(select(Deployment).filter_by(virtual_assistant_id=virtual_assistant.id))

    return deployment


def create(
    db: Session,
    virtual_assistant_id: int,
    chat_host: str,
    chat_port: int = None,
) -> Deployment:
    deployment = db.scalar(
        insert(Deployment)
        .values(
            virtual_assistant_id=virtual_assistant_id,
            chat_host=chat_host,
            chat_port=chat_port,
            state="STARTED",
        )
        .returning(Deployment)
    )

    return deployment


# def create_deployment_from_copy(
#     db: Session, original_virtual_assistant_id: int, new_virtual_assistant_id: int
# ) -> Deployment:
#     original_deployment = db.scalar(
#         select(Deployment).where(Deployment.virtual_assistant_id == original_virtual_assistant_id)
#     )
#
#     if not original_deployment:
#         raise ValueError(f"No deployments for virtual assistant with id {original_virtual_assistant_id}")
#
#     return create_deployment(
#         db,
#         new_virtual_assistant_id,
#         original_deployment.chat_host,
#         original_deployment.chat_port,
#     )


def update_by_id(db: Session, id: int, **kwargs) -> Deployment:
    deployment = db.scalar(update(Deployment).filter_by(id=id).values(**kwargs).returning(Deployment))

    return deployment


def delete_by_id(db: Session, id: int):
    db.execute(delete(Deployment).filter_by(id=id))


def get_available_deployment_port(db: Session, range_min: int = 4550, range_max: int = 4999, exclude: list = None):
    used_ports = db.scalars(
        select(Deployment.chat_port).filter(Deployment.chat_port.between(range_min, range_max))
    ).all()
    if exclude:
        used_ports += exclude

    first_available_port = None

    for port in range(range_min, range_max + 1):
        if port not in used_ports:
            first_available_port = port
            break

    if first_available_port is None:
        raise ValueError(f"All ports in range [{range_min}, {range_max}] are exhausted.")

    return first_available_port
