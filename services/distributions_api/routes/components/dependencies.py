from deeppavlov_dreamtools import AssistantDist
from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from starlette import status

from apiconfig.config import settings
from database import enums
from database.component.crud import get_by_id
from services.distributions_api import schemas
from services.distributions_api.database_maker import get_db
from services.distributions_api.security.auth import get_current_user, get_current_user_or_none


def get_component(component_id: int, db: Session = Depends(get_db)):
    component = get_by_id(db, component_id)
    if not component:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Component {component_id} not found")
    return schemas.ComponentRead.from_orm(component)


# def virtual_assistant_view_permission(
#     user: schemas.UserRead = Depends(get_current_user_or_none),
#     virtual_assistant: schemas.VirtualAssistantRead = Depends(get_virtual_assistant),
# ):
#     """"""
#     if user:
#         if user.id == virtual_assistant.author.id or user.role.can_view_private_assistants:
#             return virtual_assistant
#
#     if virtual_assistant.visibility == enums.VirtualAssistantPrivateVisibility.PRIVATE:
#         raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="No access")
#
#     elif virtual_assistant.visibility == enums.VirtualAssistantPrivateVisibility.UNLISTED_LINK:
#         if user:
#             return virtual_assistant
#         else:
#             raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not logged in")
#
#     elif virtual_assistant.visibility == enums.VirtualAssistantPrivateVisibility.UNLISTED_INVITATION:
#         raise NotImplementedError(
#             f"{enums.VirtualAssistantPrivateVisibility.UNLISTED_LINK} visibility is not supported yet"
#         )
#
#     elif (
#         virtual_assistant.visibility == enums.VirtualAssistantPublicVisibility.PUBLIC_TEMPLATE
#         and virtual_assistant.publish_state == enums.PublishRequestState.APPROVED
#     ):
#         return virtual_assistant


def component_patch_permission(
    user: schemas.UserRead = Depends(get_current_user),
    component: schemas.ComponentRead = Depends(get_component),
):
    """"""
    if user.id == component.author.id or user.id == 1:
        return component
    else:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="No access")


def component_delete_permission(
    user: schemas.UserRead = Depends(get_current_user),
    component: schemas.ComponentRead = Depends(get_component),
):
    """"""
    if user.id == component.author.id or user.id == 1:
        return component
    else:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="No access")
