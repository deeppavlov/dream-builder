from typing import List, Optional

from fastapi import APIRouter, status, Depends, HTTPException
from sqlalchemy.orm import Session

from database.models.component.crud import get_all, get_by_group_name
from services.distributions_api import schemas, const
from services.distributions_api.database_maker import get_db
from services.distributions_api.routes.components import flows
from services.distributions_api.routes.components.dependencies import (
    get_component,
    component_patch_permission,
    component_delete_permission,
)
from services.distributions_api.security.auth import get_current_user

components_router = APIRouter(prefix="/api/components", tags=["components"])


@components_router.get("", status_code=status.HTTP_200_OK)
async def get_list_of_components(db: Session = Depends(get_db)) -> List[schemas.ComponentRead]:
    return [schemas.ComponentRead.from_orm(c) for c in get_all(db)]


@components_router.post("", status_code=status.HTTP_201_CREATED)
async def create_component(
    payload: schemas.ComponentCreate,
    clone_from_id: Optional[int] = None,
    user: schemas.UserRead = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> schemas.ComponentRead:
    new_component = flows.create_component(db, payload, user, clone_from_id)

    if not new_component:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create component for {payload.display_name} of lm_service {payload.lm_service_id}"
        )
    return new_component


@components_router.get("/{component_id}", status_code=status.HTTP_200_OK)
async def get_component(
    component: schemas.ComponentRead = Depends(get_component)
) -> schemas.ComponentRead:

    return component


@components_router.patch("/{component_id}", status_code=status.HTTP_200_OK)
async def patch_component(
    payload: schemas.ComponentUpdate,
    component: schemas.ComponentRead = Depends(component_patch_permission),
    db: Session = Depends(get_db),
) -> schemas.ComponentRead:
    new_component = await flows.patch_component(db, component, payload)
    return new_component


@components_router.get("/{component_id}/generative_config", status_code=status.HTTP_200_OK)
async def get_component_generative_config(
    component: schemas.ComponentRead = Depends(get_component), db: Session = Depends(get_db)
) -> schemas.ComponentGenerativeRead:
    return schemas.ComponentGenerativeRead(**component.dict())


@components_router.delete("/{component_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_component(
    component: schemas.ComponentRead = Depends(component_delete_permission), db: Session = Depends(get_db)
):
    flows.delete_component(db, component.id)


@components_router.get("/group/{group_name}", status_code=status.HTTP_200_OK)
async def get_list_of_group_components(
    group_name: str, component_type: str = None, author_id: int = None, db: Session = Depends(get_db)
) -> List[schemas.ComponentRead]:
    group_components = []

    for c in get_by_group_name(db, group_name, component_type, author_id):
        if c.name not in const.INVISIBLE_COMPONENT_NAMES:
            group_components.append(schemas.ComponentRead.from_orm(c))

    return group_components
