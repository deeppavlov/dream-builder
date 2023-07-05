from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from starlette import status

from database.component.crud import get_by_id
from services.distributions_api import schemas
from services.distributions_api.database_maker import get_db
from services.distributions_api.security.auth import get_current_user


def get_component(component_id: int, db: Session = Depends(get_db)):
    component = get_by_id(db, component_id)
    if not component:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Component {component_id} not found")
    return schemas.ComponentRead.from_orm(component)


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
