from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from starlette import status

from database import crud
from services.distributions_api import schemas
from services.distributions_api.database_maker import get_db
from services.distributions_api.security.auth import verify_token

dialog_sessions_router = APIRouter(prefix="/api/dialog_sessions", tags=["dialog_sessions"])


class DebugChat:
    def __init__(self):
        self.history = []


debug_chat = DebugChat()


@dialog_sessions_router.post("/", status_code=status.HTTP_201_CREATED)
def create_dialog_session(
    payload: schemas.CreateDialogSessionRequest,
    user: schemas.User = Depends(verify_token),
    db: Session = Depends(get_db),
):
    """
    virtual_assistant_id

    Returns:

    """
    debug_chat.history = []
    return schemas.DialogSession(id=1, user_id=1, virtual_assistant_id=1, is_active=True)


@dialog_sessions_router.get("/{dialog_session_id}", status_code=status.HTTP_200_OK)
def get_dialog_session(
    dialog_session_id: int,
    user: schemas.User = Depends(verify_token),
    db: Session = Depends(get_db),
):
    """

    Returns:

    """
    return schemas.DialogSession(id=1, user_id=1, virtual_assistant_id=1, is_active=True)


@dialog_sessions_router.post("/{dialog_session_id}/chat", status_code=status.HTTP_201_CREATED)
def send_dialog_session_message(
    dialog_session_id: int,
    payload: schemas.DialogChatMessageRequest,
    user: schemas.User = Depends(verify_token),
    db: Session = Depends(get_db),
):
    """
    text

    Returns:

    """
    bot_response = f"This is a bot response to '{payload.text}'"

    debug_chat.history.append(schemas.DialogUtterance(author="user", text=payload.text))
    debug_chat.history.append(schemas.DialogUtterance(author="bot", text=bot_response))
    return schemas.DialogChatMessageResponse(text=bot_response)


@dialog_sessions_router.get("/{dialog_session_id}/history", status_code=status.HTTP_200_OK)
def get_dialog_session_history(
    dialog_session_id: int,
    user: schemas.User = Depends(verify_token),
    db: Session = Depends(get_db),
):
    """

    Returns:

    """
    return debug_chat.history
