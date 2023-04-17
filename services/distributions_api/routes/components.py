import json
import secrets
from typing import List

from fastapi import APIRouter, status, Depends
from sqlalchemy.orm import Session

from apiconfig.config import settings
from database import crud
from services.distributions_api import schemas
from services.distributions_api.database_maker import get_db

from deeppavlov_dreamtools.distconfigs.components import ComponentRepository

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
    name_with_underscores, name_with_dashes = name_generator.names_from_display_name(payload.display_name)

    with db.begin():
        lm_service = crud.get_lm_service(db, payload.lm_service_id)

        components_repo = ComponentRepository(settings.db.dream_root_path)
        new_component = components_repo.add_generative_prompted_skill(
            name=name_with_underscores,
            display_name=payload.display_name,
            container_name=name_with_dashes,
            author=user.email,
            description=payload.description,
            ram_usage="150M",
            port=crud.get_next_available_component_port(db),
            lm_service=lm_service.name,
            prompt=payload.prompt,
        )
        component = crud.create_component(
            db,
            source="skills/dff_template_prompted_skill",
            name=new_component.name,
            display_name=new_component.display_name,
            container_name=new_component.container_name,
            component_type=new_component.component_type,
            model_type=new_component.model_type,
            is_customizable=new_component.is_customizable,
            author_id=user.id,
            description=new_component.description,
            ram_usage=new_component.ram_usage,
            gpu_usage=new_component.gpu_usage,
            port=new_component.port,
            group="skills",
            endpoint="respond",
            build_args=new_component.build_args,
            compose_override=json.loads(new_component.compose_override.json(exclude_none=True)),
            compose_dev=json.loads(new_component.compose_dev.json(exclude_none=True)),
            compose_proxy=json.loads(new_component.compose_proxy.json(exclude_none=True)),
        )
        return schemas.ComponentShort.from_orm(component)


@components_router.delete("/{component_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_component(component_id: int, user: schemas.User = Depends(verify_token), db: Session = Depends(get_db)):
    with db.begin():
        crud.delete_component(db, component_id)


@components_router.get("/{component_id}", status_code=status.HTTP_200_OK)
async def get_component(component_id: int, db: Session = Depends(get_db)) -> schemas.ComponentShort:
    component = crud.get_component(db, component_id)

    return schemas.ComponentShort.from_orm(component)


@components_router.get("/group/{group_name}", status_code=status.HTTP_200_OK)
async def get_list_of_group_components(group_name: str, db: Session = Depends(get_db)) -> List[schemas.ComponentShort]:
    return [schemas.ComponentShort.from_orm(c) for c in crud.get_components_by_group_name(db, group_name)]
