from typing import List

from fastapi import APIRouter, status, Depends
from sqlalchemy.orm import Session

from database import crud
from services.distributions_api import schemas
from services.distributions_api.database_maker import get_db

components_router = APIRouter(prefix="/api/components", tags=["components"])


@components_router.get("/", status_code=status.HTTP_200_OK)
async def get_list_of_components(db: Session = Depends(get_db)) -> List[schemas.ComponentShort]:
    return [schemas.ComponentShort.from_orm(c) for c in crud.get_all_components(db)]


@components_router.get("/{component_id}", status_code=status.HTTP_200_OK)
async def get_component(component_id: int, db: Session = Depends(get_db)) -> schemas.ComponentShort:
    component = crud.get_component(db, component_id)

    return schemas.ComponentShort.from_orm(component)


@components_router.get("/group/{group_name}", status_code=status.HTTP_200_OK)
async def get_list_of_group_components(group_name: str, db: Session = Depends(get_db)) -> List[schemas.ComponentShort]:
    return [schemas.ComponentShort.from_orm(c) for c in crud.get_components_by_group_name(db, group_name)]
