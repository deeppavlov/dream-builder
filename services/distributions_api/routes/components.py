from typing import List

import aiohttp
from deeppavlov_dreamtools.distconfigs.components import create_generative_prompted_skill_component, DreamComponent
from deeppavlov_dreamtools.distconfigs.services import create_generative_prompted_skill_service
from deeppavlov_dreamtools.utils import generate_unique_name, load_json
from fastapi import APIRouter, status, Depends
from sqlalchemy.orm import Session

from apiconfig.config import settings
from database import crud
from git_storage.git_manager import GitManager
from services.distributions_api import schemas, const
from services.distributions_api.database_maker import get_db
from services.distributions_api.security.auth import verify_token

components_router = APIRouter(prefix="/api/components", tags=["components"])

dream_git = GitManager(
    settings.git.local_path,
    settings.git.username,
    settings.git.remote_access_token,
    settings.git.remote_source_url,
    settings.git.remote_source_branch,
    settings.git.remote_copy_url,
    # settings.git.remote_copy_branch,
    f"{settings.git.remote_copy_branch}-{settings.app.agent_user_id_prefix}",
)


async def generate_prompt_goals(prompt_goals_url: str, prompt: str, openai_api_token):
    data = {
        "prompts": [prompt],
        "openai_api_keys": [openai_api_token],
    }

    async with aiohttp.ClientSession() as session:
        async with session.post(prompt_goals_url, json=data) as response:
            response_data = await response.json()
    goals = response_data[0]

    return goals


@components_router.get("", status_code=status.HTTP_200_OK)
async def get_list_of_components(db: Session = Depends(get_db)) -> List[schemas.ComponentRead]:
    return [schemas.ComponentRead.from_orm(c) for c in crud.get_all_components(db)]


@components_router.post("", status_code=status.HTTP_201_CREATED)
async def create_component(
    payload: schemas.ComponentCreate, user: schemas.UserRead = Depends(verify_token), db: Session = Depends(get_db)
) -> schemas.ComponentRead:
    with db.begin():
        if payload.lm_service_id:
            lm_service = crud.get_lm_service(db, payload.lm_service_id)
        else:
            lm_service = crud.get_lm_service(db, 4)

        prompted_service_name = generate_unique_name()
        prompted_skill_name = f"dff_{prompted_service_name}_prompted_skill"
        prompted_skill_container_name = f"dff-{prompted_service_name}-prompted-skill"
        prompted_skill_port = 8199  # hardcoded until we implement dynamic port assignment
        prompted_service = create_generative_prompted_skill_service(
            settings.db.dream_root_path,
            f"skills/dff_template_prompted_skill/service_configs/{prompted_skill_name}",
            prompted_service_name,
            prompted_skill_name,
            prompted_skill_port,
            lm_service.name,
            lm_service.port,
        )

        prompted_component_name = generate_unique_name()
        prompted_component = create_generative_prompted_skill_component(
            settings.db.dream_root_path,
            prompted_service,
            f"components/{prompted_component_name}.yml",
            f"http://{prompted_skill_container_name}:{prompted_skill_port}/respond",
            prompted_skill_name,
            payload.display_name,
            user.email,
            payload.description,
        )

        prompt = load_json(settings.db.dream_root_path / "common/prompts/template_template.json")
        prompted_component.update_prompt(prompt["prompt"], prompt["goals"])
        prompted_component.lm_service = f"http://{lm_service.name}:{lm_service.port}/respond"
        dream_git.commit_and_push(user.id, 1)

        service = crud.create_service(db, prompted_service.service.name, str(prompted_service.config_dir))
        component = crud.create_component(
            db,
            service_id=service.id,
            source=str(prompted_component.component_file),
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
            prompt=prompted_component.prompt,
            prompt_goals=prompted_component.prompt_goals,
            lm_service_id=lm_service.id,
        )

    return schemas.ComponentRead.from_orm(component)


@components_router.get("/{component_id}", status_code=status.HTTP_200_OK)
async def get_component(component_id: int, db: Session = Depends(get_db)) -> schemas.ComponentRead:
    component = crud.get_component(db, component_id)

    return schemas.ComponentRead.from_orm(component)


@components_router.patch("/{component_id}", status_code=status.HTTP_200_OK)
async def patch_component(
    component_id: int, payload: schemas.ComponentUpdate, db: Session = Depends(get_db)
) -> schemas.ComponentRead:
    with db.begin():
        component = crud.get_component(db, component_id)
        dream_component = DreamComponent.from_file(
            settings.db.dream_root_path / component.source, settings.db.dream_root_path
        )

        if payload.display_name:
            dream_component.component.display_name = payload.display_name
        if payload.description:
            dream_component.component.description = payload.description
        prompt_goals = None
        if payload.prompt:
            goals_lm_service = crud.get_lm_service_by_name(db, "openai-api-chatgpt")
            goals_lm_service_url = f"http://{goals_lm_service.host}:{goals_lm_service.port}/generate_goals"
            prompt_goals = await generate_prompt_goals(
                goals_lm_service_url, payload.prompt, settings.app.default_openai_api_key
            )
            dream_component.update_prompt(payload.prompt, prompt_goals)
        if payload.lm_service_id:
            lm_service = crud.get_lm_service(db, payload.lm_service_id)
            dream_component.lm_service = f"http://{lm_service.name}:{lm_service.port}/respond"
            dream_component.lm_config = lm_service.default_generative_config

        dream_component.save_configs()
        dream_git.commit_and_push(1, 1)

        component = crud.update_component(
            db,
            component_id,
            display_name=payload.display_name,
            description=payload.description,
            prompt=payload.prompt,
            prompt_goals=prompt_goals,
            lm_service_id=payload.lm_service_id,
        )

    return schemas.ComponentRead.from_orm(component)


@components_router.get("/{component_id}/generative_config", status_code=status.HTTP_200_OK)
async def get_component(component_id: int, db: Session = Depends(get_db)) -> schemas.ComponentGenerativeRead:
    component = crud.get_component(db, component_id)

    return schemas.ComponentGenerativeRead.from_orm(component)


@components_router.delete("/{component_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_component(
    component_id: int, user: schemas.UserRead = Depends(verify_token), db: Session = Depends(get_db)
):
    with db.begin():
        crud.delete_component(db, component_id)


@components_router.get("/group/{group_name}", status_code=status.HTTP_200_OK)
async def get_list_of_group_components(
    group_name: str, component_type: str = None, author_id: int = None, db: Session = Depends(get_db)
) -> List[schemas.ComponentRead]:
    group_components = []

    for c in crud.get_components_by_group_name(db, group_name, component_type, author_id):
        if c.name not in const.INVISIBLE_COMPONENT_NAMES:
            group_components.append(schemas.ComponentRead.from_orm(c))

    return group_components
