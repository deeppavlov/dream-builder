from deeppavlov_dreamtools import AssistantDist
from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from starlette import status

from apiconfig.config import settings
from database import enums
from database.models.dialog_session.crud import get_by_id
from database.models.virtual_assistant import crud as virtual_assistant_crud
from services.distributions_api import schemas
from services.distributions_api.database_maker import get_db
from services.distributions_api.security.auth import get_current_user, get_current_user_or_none


def get_dialog_session(dialog_session_id: int, db: Session = Depends(get_db)):
    dialog_session = get_by_id(db, dialog_session_id)
    if not dialog_session:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Deployment {dialog_session_id} not found")

    return schemas.DialogSessionRead.from_orm(dialog_session)


def get_virtual_assistant_for_dialog_session(payload: schemas.DialogSessionCreate, db: Session = Depends(get_db)):
    try:
        virtual_assistant = virtual_assistant_crud.get_by_name(db, payload.virtual_assistant_name)
    except ValueError:
        raise HTTPException(
            status_code=404, detail=f"Virtual assistant '{payload.virtual_assistant_name}' not found in database"
        )

    try:
        dream_dist = AssistantDist.from_dist(settings.db.dream_root_path / virtual_assistant.source)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail=f"Virtual assistant '{virtual_assistant.source}' not found locally")

    return schemas.VirtualAssistantRead.from_orm(virtual_assistant)


def dialog_session_create_permission(
    virtual_assistant: schemas.VirtualAssistantRead = Depends(get_virtual_assistant_for_dialog_session),
    user: schemas.UserRead = Depends(get_current_user_or_none),
):
    if user:
        if user.id == virtual_assistant.author.id or user.role.can_view_private_assistants:
            return virtual_assistant

    if virtual_assistant.visibility == enums.VirtualAssistantPrivateVisibility.PRIVATE:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="No access")

    elif virtual_assistant.visibility == enums.VirtualAssistantPrivateVisibility.UNLISTED_INVITATION:
        raise NotImplementedError(
            f"{enums.VirtualAssistantPrivateVisibility.UNLISTED_INVITATION} visibility is not supported yet"
        )

    elif (
        virtual_assistant.visibility == enums.VirtualAssistantPublicVisibility.PUBLIC_TEMPLATE
        and virtual_assistant.publish_state == enums.PublishRequestState.APPROVED
    ) or virtual_assistant.visibility == enums.VirtualAssistantPrivateVisibility.UNLISTED_LINK:
        return virtual_assistant


def dialog_session_permission(
    user: schemas.UserRead = Depends(get_current_user_or_none),
    dialog_session: schemas.DialogSessionRead = Depends(get_dialog_session),
):
    """"""
    if user:
        user_id = user.id
    else:
        user_id = None

    if dialog_session.user_id:
        if user_id != dialog_session.user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="No access")

    return dialog_session
