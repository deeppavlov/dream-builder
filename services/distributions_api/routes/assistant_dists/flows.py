from typing import Union
from urllib.parse import urlparse

from deeppavlov_dreamtools import AssistantDist
from deeppavlov_dreamtools.distconfigs.components import DreamComponent
from deeppavlov_dreamtools.utils import generate_unique_name
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from apiconfig.config import settings
from database import enums
from database.models.component import crud as component_crud
from database.models.lm_service import crud as lm_service_crud
from database.models.publish_request import crud as publish_request_crud
from database.models.service import crud as service_crud
from database.models.virtual_assistant.crud import get_by_name, create, update_metadata_by_name, delete_by_name, update_by_name
from database.models.virtual_assistant_component import crud as virtual_assistant_component_crud
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


def create_virtual_assistant(
    db: Session,
    template_name: str,
    display_name: str,
    description: str,
    author_id: int,
    author_email: str,
    is_cloned: bool = False,
) -> schemas.VirtualAssistantRead:
    try:
        template_virtual_assistant = get_by_name(db, template_name)
        dream_dist = AssistantDist.from_dist(settings.db.dream_root_path / template_virtual_assistant.source)

        new_name = generate_unique_name()
        original_prompted_skills = virtual_assistant_component_crud.get_by_component_name_like(
            db, template_virtual_assistant.id, "_prompted_skill"
        )
        existing_prompted_skills = []

        for skill in original_prompted_skills:
            existing_prompted_skill = {
                "name": skill.component.name,
                "port": dream_dist.pipeline.skills[skill.component.name].service.environment.get("SERVICE_PORT"),
                "command": dream_dist.pipeline.skills[skill.component.name].service.service.compose.command,
                "lm_service_model": urlparse(dream_dist.pipeline.skills[skill.component.name].lm_service).hostname,
                "lm_service_port": urlparse(dream_dist.pipeline.skills[skill.component.name].lm_service).port,
                "lm_config": dream_dist.pipeline.skills[skill.component.name].lm_config,
                "prompt": dream_dist.pipeline.skills[skill.component.name].prompt,
                "prompt_goals": dream_dist.pipeline.skills[skill.component.name].prompt_goals,
                "display_name": dream_dist.pipeline.skills[skill.component.name].component.display_name,
                "description": dream_dist.pipeline.skills[skill.component.name].component.description,
            }
            existing_prompted_skills.append(existing_prompted_skill)

        new_dist = dream_dist.clone(
            new_name,
            display_name,
            author_email,
            description,
            existing_prompted_skills,
        )
        new_dist.save(generate_configs=True)
        dream_git.commit_all_files(author_id, 1)

        new_components = []
        for group, name, dream_component in new_dist.pipeline.iter_components():
            service = service_crud.get_or_create(
                db, dream_component.service.service.name, str(dream_component.service.config_dir)
            )

            if dream_component.lm_service:
                lm_service_id = lm_service_crud.get_lm_service_by_name(
                    db, urlparse(dream_component.lm_service).hostname
                ).id
            else:
                lm_service_id = None

            component = component_crud.create(
                db,
                service_id=service.id,
                source=str(dream_component.component_file),
                name=dream_component.component.name,
                display_name=dream_component.component.display_name,
                component_type=dream_component.component.component_type,
                is_customizable=dream_component.component.is_customizable,
                author_id=author_id,
                ram_usage=dream_component.component.ram_usage,
                group=dream_component.component.group,
                endpoint=dream_component.component.endpoint,
                model_type=dream_component.component.model_type,
                gpu_usage=dream_component.component.gpu_usage,
                description=dream_component.component.description,
                prompt=dream_component.prompt,
                prompt_goals=dream_component.prompt_goals,
                lm_service_id=lm_service_id,
                lm_config=dream_component.lm_config,
            )
            new_components.append(component)

        new_virtual_assistant = create(
            db=db,
            author_id=author_id,
            source=str(new_dist.dist_path.relative_to(settings.db.dream_root_path)),
            name=new_dist.name,
            display_name=display_name,
            description=description,
            components=new_components,
            cloned_from_id=template_virtual_assistant.id if is_cloned else None,
        )
    except IntegrityError:
        db.rollback()
    else:
        db.commit()
        return schemas.VirtualAssistantRead.from_orm(new_virtual_assistant)


def patch_virtual_assistant(
    db: Session,
    virtual_assistant: schemas.VirtualAssistantRead,
    user_id: int,
    display_name: str = None,
    description: str = None,
) -> schemas.VirtualAssistantRead:
    dream_dist = AssistantDist.from_dist(settings.db.dream_root_path / virtual_assistant.source)

    if display_name:
        dream_dist.pipeline_conf.display_name = display_name
        virtual_assistant = update_metadata_by_name(db, virtual_assistant.name, display_name=display_name)

    if description:
        dream_dist.pipeline_conf.description = description
        virtual_assistant = update_metadata_by_name(db, virtual_assistant.name, description=description)

    db.commit()

    dream_dist.save(overwrite=True)
    dream_git.commit_all_files(user_id, 1)

    return schemas.VirtualAssistantRead.from_orm(virtual_assistant)


def delete_virtual_assistant(db: Session, virtual_assistant: schemas.VirtualAssistantRead, user_id: int) -> None:
    try:
        dream_dist = AssistantDist.from_dist(settings.db.dream_root_path / virtual_assistant.source)
        dream_dist.delete()
        dream_git.commit_all_files(user_id, 1)
    except FileNotFoundError:
        pass

    delete_by_name(db, virtual_assistant.name)
    db.commit()


def add_virtual_assistant_component(
    db: Session, virtual_assistant: schemas.VirtualAssistantRead, component_id: int
) -> schemas.VirtualAssistantComponentRead:
    dream_dist = AssistantDist.from_dist(settings.db.dream_root_path / virtual_assistant.source)

    virtual_assistant_component = virtual_assistant_component_crud.create(db, virtual_assistant.id, component_id)
    db.commit()

    dream_dist.add_generative_prompted_skill(
        DreamComponent.from_file(virtual_assistant_component.component.source, settings.db.dream_root_path)
    )
    dream_dist.save(overwrite=True, generate_configs=True)
    dream_git.commit_all_files(1, 1)

    return schemas.VirtualAssistantComponentRead.from_orm(virtual_assistant_component)


def delete_virtual_assistant_component(
    db: Session, virtual_assistant: schemas.VirtualAssistantRead, virtual_assistant_component_id: int
) -> None:
    dream_dist = AssistantDist.from_dist(settings.db.dream_root_path / virtual_assistant.source)

    virtual_assistant_component = virtual_assistant_component_crud.get_by_id(db, virtual_assistant_component_id)
    dream_dist.remove_generative_prompted_skill(virtual_assistant_component.component.name)
    dream_dist.save(overwrite=True, generate_configs=True)
    dream_git.commit_all_files(1, 1)

    virtual_assistant_component_crud.delete_by_id(db, virtual_assistant_component_id)
    db.commit()


def publish_virtual_assistant(
    db: Session,
    virtual_assistant: schemas.VirtualAssistantRead,
    visibility: Union[enums.VirtualAssistantPrivateVisibility, enums.VirtualAssistantPublicVisibility],
    user_id: int,
):
    dist = AssistantDist.from_dist(settings.db.dream_root_path / virtual_assistant.source)

    if visibility.__class__ == enums.VirtualAssistantPrivateVisibility:
        publish_request_crud.delete_publish_request(db, virtual_assistant.id)
        virtual_assistant = update_by_name(db, dist.name, private_visibility=visibility)
    elif visibility.__class__ == enums.VirtualAssistantPublicVisibility:
        publish_request_crud.create_publish_request(
            db, virtual_assistant.id, user_id, virtual_assistant.name, visibility
        )
        # moderators = user_crud.get_by_role(db, 2)
    db.commit()
