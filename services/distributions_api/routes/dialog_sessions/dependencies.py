from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from starlette import status

from database.models.dialog_session.crud import get_by_id
from services.distributions_api import schemas
from services.distributions_api.database_maker import get_db
from services.distributions_api.security.auth import get_current_user, get_current_user_or_none


def get_dialog_session(dialog_session_id: int, db: Session = Depends(get_db)):
    dialog_session = get_by_id(db, dialog_session_id)
    if not dialog_session:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Deployment {dialog_session_id} not found")

    return schemas.DialogSessionRead.from_orm(dialog_session)


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
