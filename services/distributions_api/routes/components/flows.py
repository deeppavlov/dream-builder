import aiohttp
from deeppavlov_dreamtools.distconfigs.components import DreamComponent, create_generative_prompted_skill_component
from deeppavlov_dreamtools.distconfigs.services import create_generative_prompted_skill_service
from deeppavlov_dreamtools.utils import generate_unique_name, load_json
from sqlalchemy.orm import Session

from apiconfig.config import settings
from database.models.component.crud import update_by_id, delete_by_id, get_by_id, create
from database.models.lm_service import crud as lm_service_crud
from database.models.service import crud as service_crud
from git_storage.git_manager import GitManager
from services.distributions_api import schemas

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


def create_component(
    db: Session,
    new_component: schemas.ComponentCreate,
    user: schemas.UserRead,
    clone_from_id: int = None,
):
    with db.begin():
        lm_service = prompt = prompt_goals = lm_config = None

        if clone_from_id:
            original_component = get_by_id(db, clone_from_id)
            lm_service = original_component.lm_service
            prompt = original_component.prompt
            prompt_goals = original_component.prompt_goals
        else:
            if new_component.lm_service_id:
                lm_service = lm_service_crud.get_lm_service(db, new_component.lm_service_id)
            else:
                lm_service = lm_service_crud.get_lm_service(db, 4)

            if new_component.prompt and new_component.prompt_goals:
                prompt = new_component.prompt
                prompt_goals = new_component.prompt_goals
            else:
                prompt_data = load_json(settings.db.dream_root_path / "common/prompts/template_template.json")
                prompt, prompt_goals = prompt_data["prompt"], prompt_data["goals"]

            if new_component.lm_config:
                lm_config = new_component.lm_config
            else:
                lm_config = load_json(
                    settings.db.dream_root_path / "common" / "generative_configs" / lm_service.default_generative_config
                )

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
            lm_config,
            prompt,
            prompt_goals,
        )

        prompted_component_name = generate_unique_name()
        prompted_component = create_generative_prompted_skill_component(
            settings.db.dream_root_path,
            prompted_service,
            f"components/{prompted_component_name}.yml",
            f"http://{prompted_skill_container_name}:{prompted_skill_port}/respond",
            prompted_skill_name,
            new_component.display_name,
            user.email,
            new_component.description,
        )
        dream_git.commit_all_files(user.id, 1)

        service = service_crud.get_or_create(db, prompted_service.service.name, str(prompted_service.config_dir))
        component = create(
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
            lm_config=prompted_component.lm_config,
        )

    return schemas.ComponentRead.from_orm(component)


async def patch_component(
    db: Session,
    component: schemas.ComponentRead,
    component_update: schemas.ComponentUpdate,
) -> schemas.ComponentRead:
    dream_component = DreamComponent.from_file(
        settings.db.dream_root_path / component.source, settings.db.dream_root_path
    )

    if component_update.display_name:
        dream_component.component.display_name = component_update.display_name

    if component_update.description:
        dream_component.component.description = component_update.description

    prompt_goals = None
    if component_update.prompt:
        goals_lm_service = lm_service_crud.get_lm_service_by_name(db, "openai-api-chatgpt")
        goals_lm_service_url = f"http://{goals_lm_service.host}:{goals_lm_service.port}/generate_goals"
        prompt_goals = await generate_prompt_goals(
            goals_lm_service_url, component_update.prompt, settings.app.default_openai_api_key
        )
        dream_component.update_prompt(component_update.prompt, prompt_goals)

    if component_update.lm_service_id:
        lm_service = lm_service_crud.get_lm_service(db, component_update.lm_service_id)
        dream_component.lm_service = f"http://{lm_service.name}:{lm_service.port}/respond"
        if component_update.lm_config:
            dream_component.lm_config = component_update.lm_config
        else:
            dream_component.lm_config = load_json(
                settings.db.dream_root_path / "common" / "generative_configs" / lm_service.default_generative_config
            )

    dream_component.save_configs()
    dream_git.commit_all_files(1, 1)

    component = update_by_id(
        db,
        component.id,
        display_name=component_update.display_name,
        description=component_update.description,
        prompt=component_update.prompt,
        prompt_goals=prompt_goals,
        lm_service_id=component_update.lm_service_id,
        lm_config=dream_component.lm_config,
    )
    db.commit()

    return schemas.ComponentRead.from_orm(component)


def delete_component(db: Session, component_id: int) -> None:
    delete_by_id(db, component_id)
    db.commit()
