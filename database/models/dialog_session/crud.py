from sqlalchemy import update, and_
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.orm import Session

from database.models.dialog_session.model import DialogSession
from database.models.virtual_assistant import crud as virtual_assistant_crud


def get_dialog_session(db: Session, dialog_session_id: int):
    dialog_session = db.get(DialogSession, dialog_session_id)
    if not dialog_session:
        raise ValueError(f"Dialog session {dialog_session_id} does not exist")

    return dialog_session


def get_debug_assistant_chat_url(db: Session) -> str:
    debug_assistant = virtual_assistant_crud.get_by_name(db, "universal_prompted_assistant")

    return f"{debug_assistant.deployment.chat_host}:{debug_assistant.deployment.chat_port}"


def create_dialog_session_by_name(db: Session, user_id: int, virtual_assistant_name: str) -> DialogSession:
    virtual_assistant = virtual_assistant_crud.get_by_name(db, virtual_assistant_name)

    invalidated_sessions = db.scalars(
        update(DialogSession)
        .where(
            and_(
                DialogSession.user_id == user_id,
                DialogSession.deployment_id == virtual_assistant.deployment.id,
            )
        )
        .values(is_active=False)
        .returning(DialogSession)
    ).all()
    # logger.info(f"Invalidated sessions: {', '.join(str(s.id) for s in invalidated_sessions)}")

    dialog_session = db.scalar(
        insert(DialogSession)
        .values(user_id=user_id, deployment_id=virtual_assistant.deployment.id, is_active=True)
        .returning(DialogSession)
    )

    return dialog_session


def update_dialog_session(db: Session, dialog_session_id: int, agent_dialog_id: str) -> DialogSession:
    dialog_session = db.scalar(
        update(DialogSession)
        .where(DialogSession.id == dialog_session_id)
        .values(agent_dialog_id=agent_dialog_id)
        .returning(DialogSession)
    )

    return dialog_session
