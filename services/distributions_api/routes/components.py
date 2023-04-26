import json
import secrets
from typing import List

from deeppavlov_dreamtools.distconfigs.services import create_generative_prompted_skill_service
from fastapi import APIRouter, status, Depends
from sqlalchemy.orm import Session

from apiconfig.config import settings
from database import crud
from services.distributions_api import schemas
from services.distributions_api.database_maker import get_db

from deeppavlov_dreamtools.distconfigs.components import DreamComponent, create_generative_prompted_skill_component
from deeppavlov_dreamtools.utils import generate_unique_name

from services.distributions_api.security.auth import verify_token
from services.distributions_api.utils import name_generator

components_router = APIRouter(prefix="/api/components", tags=["components"])


@components_router.get("/", status_code=status.HTTP_200_OK)
async def get_list_of_components(db: Session = Depends(get_db)) -> List[schemas.ComponentShort]:
    return [schemas.ComponentShort.from_orm(c) for c in crud.get_all_components(db)]


@components_router.post("/", status_code=status.HTTP_201_CREATED)
async def create_component(
    payload: schemas.ComponentCreate, user: schemas.User = Depends(verify_token), db: Session = Depends(get_db)
) -> schemas.ComponentShort:
    with db.begin():
        lm_service = crud.get_lm_service(db, payload.lm_service_id)

        prompted_service_name = generate_unique_name()
        prompted_service = create_generative_prompted_skill_service(
            settings.db.dream_root_path,
            f"skills/dff_template_prompted_skill/service_configs/{prompted_service_name}",
            prompted_service_name,
            "transformers-lm-oasst12b",
        )

        prompted_component_name = generate_unique_name()
        prompted_component = create_generative_prompted_skill_component(
            settings.db.dream_root_path,
            prompted_service,
            f"components/{prompted_component_name}.yml",
            "this-url-does-not-work:123",
            prompted_component_name,
            payload.display_name,
            user.email,
            payload.description,
        )

        service = crud.create_service(db, prompted_service.service.name, str(prompted_service.config_dir))

        component = crud.create_component(
            db,
            service_id=service.id,
            source="skills/dff_template_prompted_skill",
            name=prompted_component.component.name,
            display_name=prompted_component.component.display_name,
            component_type=prompted_component.component.component_type,
            is_customizable=prompted_component.component.is_customizable,
            author_id=user.id,
            ram_usage=prompted_component.component.ram_usage,
            group="skills",
            endpoint="respond",
            model_type=prompted_component.component.model_type,
            gpu_usage=prompted_component.component.gpu_usage,
            description=prompted_component.component.description,
        )
        return schemas.ComponentShort.from_orm(component)


@components_router.get("/{component_id}", status_code=status.HTTP_200_OK)
async def get_component(component_id: int, db: Session = Depends(get_db)) -> schemas.ComponentShort:
    component = crud.get_component(db, component_id)

    return schemas.ComponentShort.from_orm(component)


@components_router.patch("/{component_id}", status_code=status.HTTP_200_OK)
async def patch_component(
    component_id: int, payload: schemas.ComponentUpdate, db: Session = Depends(get_db)
) -> schemas.ComponentShort:
    with db.begin():
        component = crud.update_component(
            db, component_id, display_name=payload.display_name, description=payload.description
        )

    return schemas.ComponentShort.from_orm(component)


@components_router.delete("/{component_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_component(
    component_id: int, user: schemas.User = Depends(verify_token), db: Session = Depends(get_db)
):
    with db.begin():
        crud.delete_component(db, component_id)


@components_router.get("/group/{group_name}", status_code=status.HTTP_200_OK)
async def get_list_of_group_components(
    group_name: str, component_type: str = None, db: Session = Depends(get_db)
) -> List[schemas.ComponentShort]:
    return [
        schemas.ComponentShort.from_orm(c) for c in crud.get_components_by_group_name(db, group_name, component_type)
    ]
