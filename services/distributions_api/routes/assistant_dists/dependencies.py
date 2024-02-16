from deeppavlov_dreamtools import AssistantDist
from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from starlette import status
from typing import List

from apiconfig.config import settings
from database import enums
from database.models.virtual_assistant.crud import get_by_name
from services.distributions_api import schemas
from services.distributions_api.database_maker import get_db
from services.distributions_api.security.auth import get_current_user, get_current_user_or_none


def get_virtual_assistant(dist_name: str, db: Session = Depends(get_db)):
    try:
        virtual_assistant = get_by_name(db, dist_name)
    except ValueError:
        raise HTTPException(status_code=404, detail=f"Virtual assistant '{dist_name}' not found in database")

    try:
        # TODO:`AssistantDist.from_dist` is a quite expensive operation. Should be replaced with `check_VA_locally` func
        dream_dist = AssistantDist.from_dist(settings.db.dream_root_path / virtual_assistant.source)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail=f"Virtual assistant '{virtual_assistant.source}' not found locally")

    return schemas.VirtualAssistantRead.from_orm(virtual_assistant)


def get_virtual_assistants(dist_names: List[str], db: Session = Depends(get_db)) -> List[schemas.VirtualAssistantRead]:
    virtual_assistants = []

    for dist_name in dist_names:
        try:
            virtual_assistant = get_by_name(db, dist_name)
        except ValueError:
            raise HTTPException(status_code=404, detail=f"Virtual assistant '{dist_name}' not found in database")

        try:
            dream_dist = AssistantDist.from_dist(settings.db.dream_root_path / virtual_assistant.source)
        except FileNotFoundError:
            raise HTTPException(status_code=404, detail=f"Assistant '{virtual_assistant.source}' not found locally")

        virtual_assistants.append(schemas.VirtualAssistantRead.from_orm(virtual_assistant))

    return virtual_assistants


def virtual_assistant_view_permission(
    user: schemas.UserRead = Depends(get_current_user_or_none),
    virtual_assistant: schemas.VirtualAssistantRead = Depends(get_virtual_assistant),
):
    """"""
    if user:
        if user.id == virtual_assistant.author.id or user.role.can_view_private_assistants:
            return virtual_assistant

    if virtual_assistant.visibility == enums.VirtualAssistantPrivateVisibility.PRIVATE:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="No access")

    elif virtual_assistant.visibility == enums.VirtualAssistantPrivateVisibility.UNLISTED_LINK:
        return virtual_assistant

    elif virtual_assistant.visibility == enums.VirtualAssistantPrivateVisibility.UNLISTED_INVITATION:
        raise NotImplementedError(
            f"{enums.VirtualAssistantPrivateVisibility.UNLISTED_LINK} visibility is not supported yet"
        )

    elif (
        virtual_assistant.visibility == enums.VirtualAssistantPublicVisibility.PUBLIC_TEMPLATE
        and virtual_assistant.publish_state == enums.PublishRequestState.APPROVED
    ):
        return virtual_assistant


def virtual_assistant_patch_permission(
    user: schemas.UserRead = Depends(get_current_user),
    virtual_assistant: schemas.VirtualAssistantRead = Depends(get_virtual_assistant),
):
    """"""
    if user.id == virtual_assistant.author.id:
        return virtual_assistant


def virtual_assistant_delete_permission(
    user: schemas.UserRead = Depends(get_current_user),
    virtual_assistant: schemas.VirtualAssistantRead = Depends(get_virtual_assistant),
):
    """"""
    if user.id == virtual_assistant.author.id:
        return virtual_assistant


async def virtual_assistants_patch_permission(
        dist_names: List[str],
        user: schemas.UserRead = Depends(get_current_user),
        db: Session = Depends(get_db)
):
    virtual_assistants = get_virtual_assistants(dist_names, db)

    for virtual_assistant in virtual_assistants:
        if user.id != virtual_assistant.author.id:
            raise HTTPException(status_code=403, detail="User does not have permission to modify virtual assistant")

    return virtual_assistants
