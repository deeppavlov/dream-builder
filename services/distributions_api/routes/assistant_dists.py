from typing import List
from urllib.parse import urlparse

from deeppavlov_dreamtools.distconfigs.assistant_dists import AssistantDist
from deeppavlov_dreamtools.distconfigs.components import DreamComponent
from deeppavlov_dreamtools.utils import generate_unique_name
from fastapi import APIRouter, status, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session

from apiconfig.config import settings
from database import crud, models, enums
from git_storage.git_manager import GitManager
from services.distributions_api import schemas, const
from services.distributions_api.const import TEMPLATE_DIST_PROMPT_BASED
from services.distributions_api.database_maker import get_db
from services.distributions_api.security.auth import verify_token
from services.distributions_api.utils import name_generator
from services.distributions_api.utils.emailer import Emailer

assistant_dists_router = APIRouter(prefix="/api/assistant_dists", tags=["assistant_dists"])

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


def send_publish_request_created_emails(
    owner_email: str, moderator_emails: List[str], virtual_assistant_name: str, virtual_assistant_display_name: str
):
    emailer = Emailer(settings.smtp.server, settings.smtp.port, settings.smtp.user, settings.smtp.password)

    for moderator_email in moderator_emails:
        emailer.send_publish_request_created_to_moderators(
            moderator_email, owner_email, virtual_assistant_name, virtual_assistant_display_name
        )
    emailer.send_publish_request_created_to_owner(owner_email, virtual_assistant_display_name)


@assistant_dists_router.post("", status_code=status.HTTP_201_CREATED)
async def create_virtual_assistant(
    payload: schemas.VirtualAssistantCreate,
    user: schemas.UserRead = Depends(verify_token),
    db: Session = Depends(get_db),
) -> schemas.VirtualAssistantRead:
    """
    Creates new distribution from base template

    **Payload args**

    -``display_name``: new assistant dist display name

    -``description``: new assistant dist description
    """
    with db.begin():
        minimal_template_virtual_assistant = crud.get_virtual_assistant_by_name(db, TEMPLATE_DIST_PROMPT_BASED)
        dream_dist = AssistantDist.from_dist(settings.db.dream_root_path / minimal_template_virtual_assistant.source)

        new_name = generate_unique_name()
        original_prompted_skills = crud.get_virtual_assistant_components_with_component_name_like(
            db, minimal_template_virtual_assistant.id, "_prompted_skill"
        )
        existing_prompted_skills = []

        for skill in original_prompted_skills:
            existing_prompted_skill = {
                "name": skill.component.name,
                "port": dream_dist.pipeline.skills[skill.component.name].service.environment.get("SERVICE_PORT"),
                "command": dream_dist.pipeline.skills[skill.component.name].service.service.compose.command,
                "lm_service_model": urlparse(dream_dist.pipeline.skills[skill.component.name].lm_service).hostname,
                "lm_service_port": urlparse(dream_dist.pipeline.skills[skill.component.name].lm_service).port,
                "prompt": dream_dist.pipeline.skills[skill.component.name].prompt,
                "prompt_goals": dream_dist.pipeline.skills[skill.component.name].prompt_goals,
                "display_name": dream_dist.pipeline.skills[skill.component.name].component.display_name,
                "description": dream_dist.pipeline.skills[skill.component.name].component.description,
            }
            existing_prompted_skills.append(existing_prompted_skill)

        new_dist = dream_dist.clone(
            new_name,
            payload.display_name,
            user.email,
            payload.description,
            existing_prompted_skills,
        )
        new_dist.save(generate_configs=True)
        dream_git.commit_and_push(
            user.id,
            1,
            str(settings.db.dream_root_path / "assistant_dists"),
            str(settings.db.dream_root_path / "components"),
        )

        new_components = []
        for group, name, dream_component in new_dist.pipeline.iter_components():
            service = crud.create_service(
                db, dream_component.service.service.name, str(dream_component.service.config_dir)
            )

            if dream_component.lm_service:
                lm_service_id = crud.get_lm_service_by_name(db, urlparse(dream_component.lm_service).hostname).id
            else:
                lm_service_id = None

            component = crud.create_component(
                db,
                service_id=service.id,
                source=str(dream_component.component_file),
                name=dream_component.component.name,
                display_name=dream_component.component.display_name,
                component_type=dream_component.component.component_type,
                is_customizable=dream_component.component.is_customizable,
                author_id=user.id,
                ram_usage=dream_component.component.ram_usage,
                group=dream_component.component.group,
                endpoint=dream_component.component.endpoint,
                model_type=dream_component.component.model_type,
                gpu_usage=dream_component.component.gpu_usage,
                description=dream_component.component.description,
                prompt=dream_component.prompt,
                lm_service_id=lm_service_id,
            )
            new_components.append(component)

        new_virtual_assistant = crud.create_virtual_assistant(
            db,
            user.id,
            str(new_dist.dist_path.relative_to(settings.db.dream_root_path)),
            new_dist.name,
            payload.display_name,
            payload.description,
            new_components,
        )

    return schemas.VirtualAssistantRead.from_orm(new_virtual_assistant)


@assistant_dists_router.get("/public_templates", status_code=status.HTTP_200_OK)
async def get_list_of_public_virtual_assistants(db: Session = Depends(get_db)) -> List[schemas.VirtualAssistantRead]:
    """
    Lists public Dream distributions
    """
    public_dists = []

    for dist in crud.get_all_public_templates_virtual_assistants(db):
        if dist.name not in const.INVISIBLE_VIRTUAL_ASSISTANT_NAMES:
            public_dists.append(schemas.VirtualAssistantRead.from_orm(dist))

    return public_dists


@assistant_dists_router.get("/user_owned", status_code=status.HTTP_200_OK)
async def get_list_of_private_virtual_assistants(
    user: schemas.UserRead = Depends(verify_token), db: Session = Depends(get_db)
) -> List[schemas.VirtualAssistantRead]:
    """
    Lists private Dream distributions

    **Header args**

    -``token``: auth token
    """
    private_dists = []

    for dist in crud.get_all_user_virtual_assistants(db, user.id):
        if dist.name not in const.INVISIBLE_VIRTUAL_ASSISTANT_NAMES:
            private_dists.append(schemas.VirtualAssistantRead.from_orm(dist))

    return private_dists


@assistant_dists_router.get("/{dist_name}", status_code=status.HTTP_200_OK)
async def get_virtual_assistant_by_name(dist_name: str, db: Session = Depends(get_db)) -> schemas.VirtualAssistantRead:
    """
    Returns existing dist with the given name

    **Path args**

    -``dist_name``: name of the distribution
    """
    try:
        virtual_assistant = crud.get_virtual_assistant_by_name(db, dist_name)
    except ValueError:
        raise HTTPException(status_code=404, detail=f"Virtual assistant '{dist_name}' not found in database")

    try:
        dream_dist = AssistantDist.from_dist(settings.db.dream_root_path / virtual_assistant.source)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail=f"Virtual assistant '{virtual_assistant.source}' not found locally")

    return schemas.VirtualAssistantRead.from_orm(virtual_assistant)


@assistant_dists_router.patch("/{dist_name}", status_code=status.HTTP_200_OK)
async def patch_virtual_assistant_by_name(
    dist_name: str,
    payload: schemas.VirtualAssistantUpdate,
    user: str = Depends(verify_token),
    db: Session = Depends(get_db),
) -> schemas.VirtualAssistantRead:
    """
    Updates existing dist with edited name and/or description

    **Header args**

    -``token``: auth token

    **Path args**

    -``dist_name``: name of the distribution

    **Payload args**

    -``display_name``: new assistant dist display name

    -``description``: new assistant dist description
    """
    with db.begin():
        virtual_assistant = crud.get_virtual_assistant_by_name(db, dist_name)
        dream_dist = AssistantDist.from_dist(settings.db.dream_root_path / virtual_assistant.source)

        if payload.display_name:
            dream_dist.pipeline_conf.display_name = payload.display_name
            virtual_assistant = crud.update_virtual_assistant_metadata_by_name(
                db, virtual_assistant.name, display_name=payload.display_name
            )

        if payload.description:
            dream_dist.pipeline_conf.description = payload.description
            virtual_assistant = crud.update_virtual_assistant_metadata_by_name(
                db, virtual_assistant.name, description=payload.description
            )

        dream_dist.save(overwrite=True)

    return schemas.VirtualAssistantRead.from_orm(virtual_assistant)


@assistant_dists_router.delete("/{dist_name}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_virtual_assistant_by_name(
    dist_name: str, user: schemas.UserRead = Depends(verify_token), db: Session = Depends(get_db)
):
    """
    Deletes existing dist

    **Header args**

    -``token``: auth token

    **Path args**

    -``dist_name``: name of the distribution
    """
    with db.begin():
        virtual_assistant = crud.get_virtual_assistant_by_name(db, dist_name)

        try:
            dream_dist = AssistantDist.from_dist(settings.db.dream_root_path / virtual_assistant.source)
            dream_dist.delete()
        except FileNotFoundError:
            pass

        crud.delete_virtual_assistant_by_name(db, dist_name)


@assistant_dists_router.post("/{dist_name}/clone", status_code=status.HTTP_201_CREATED)
async def clone_dist(
    dist_name: str,
    payload: schemas.VirtualAssistantCreate,
    user: schemas.UserRead = Depends(verify_token),
    db: Session = Depends(get_db),
) -> schemas.VirtualAssistantRead:
    """
    Clones new distribution from an existing one

    **Header args**

    -``token``: auth token

    **Path args**

    -``dist_name``: name of the distribution

    **Payload args**

    -``display_name``: new assistant dist display name

    -``description``: new assistant dist description
    """
    with db.begin():
        original_virtual_assistant = crud.get_virtual_assistant_by_name(db, dist_name)
        dream_dist = AssistantDist.from_dist(settings.db.dream_root_path / original_virtual_assistant.source)

        new_name = generate_unique_name()
        original_prompted_skills = crud.get_virtual_assistant_components_with_component_name_like(
            db, original_virtual_assistant.id, "_prompted_skill"
        )
        existing_prompted_skills = []

        for skill in original_prompted_skills:
            existing_prompted_skill = {
                "name": skill.component.name,
                "port": dream_dist.pipeline.skills[skill.component.name].service.environment.get("SERVICE_PORT"),
                "command": dream_dist.pipeline.skills[skill.component.name].service.service.compose.command,
                "lm_service_model": urlparse(dream_dist.pipeline.skills[skill.component.name].lm_service).hostname,
                "lm_service_port": urlparse(dream_dist.pipeline.skills[skill.component.name].lm_service).port,
                "prompt": dream_dist.pipeline.skills[skill.component.name].prompt,
                "prompt_goals": dream_dist.pipeline.skills[skill.component.name].prompt_goals,
                "display_name": dream_dist.pipeline.skills[skill.component.name].component.display_name,
                "description": dream_dist.pipeline.skills[skill.component.name].component.description,
            }
            existing_prompted_skills.append(existing_prompted_skill)

        new_dist = dream_dist.clone(
            new_name,
            payload.display_name,
            user.email,
            payload.description,
            existing_prompted_skills,
        )
        new_dist.save(overwrite=False)

        new_components = []
        for group, name, dream_component in new_dist.pipeline.iter_components():
            service = crud.create_service(
                db, dream_component.service.service.name, str(dream_component.service.config_dir)
            )

            if dream_component.lm_service:
                lm_service_id = crud.get_lm_service_by_name(db, urlparse(dream_component.lm_service).hostname).id
            else:
                lm_service_id = None

            component = crud.create_component(
                db,
                service_id=service.id,
                source=str(dream_component.component_file),
                name=dream_component.component.name,
                display_name=dream_component.component.display_name,
                component_type=dream_component.component.component_type,
                is_customizable=dream_component.component.is_customizable,
                author_id=user.id,
                ram_usage=dream_component.component.ram_usage,
                group=dream_component.component.group,
                endpoint=dream_component.component.endpoint,
                model_type=dream_component.component.model_type,
                gpu_usage=dream_component.component.gpu_usage,
                description=dream_component.component.description,
                prompt=dream_component.prompt,
                prompt_goals=dream_component.prompt_goals,
                lm_service_id=lm_service_id,
            )
            new_components.append(component)

        new_virtual_assistant = crud.create_virtual_assistant(
            db,
            user.id,
            str(new_dist.dist_path.relative_to(settings.db.dream_root_path)),
            new_dist.name,
            payload.display_name,
            payload.description,
            new_components,
            cloned_from_id=original_virtual_assistant.id,
        )

    return schemas.VirtualAssistantRead.from_orm(new_virtual_assistant)


def _virtual_assistant_component_model_to_schema(virtual_assistant_component: models.VirtualAssistantComponent):
    return schemas.VirtualAssistantComponentRead(
        id=virtual_assistant_component.id,
        component_id=virtual_assistant_component.component_id,
        name=virtual_assistant_component.component.name,
        display_name=virtual_assistant_component.component.display_name,
        component_type=virtual_assistant_component.component.component_type,
        model_type=virtual_assistant_component.component.model_type,
        is_customizable=virtual_assistant_component.component.is_customizable,
        author=virtual_assistant_component.component.author,
        description=virtual_assistant_component.component.description,
        ram_usage=virtual_assistant_component.component.ram_usage,
        gpu_usage=virtual_assistant_component.component.gpu_usage,
        prompt=virtual_assistant_component.component.prompt,
        lm_service=virtual_assistant_component.component.lm_service,
        date_created=virtual_assistant_component.component.date_created,
        is_enabled=virtual_assistant_component.is_enabled,
    )


@assistant_dists_router.get("/{dist_name}/components", status_code=status.HTTP_200_OK)
async def get_virtual_assistant_components(dist_name: str, db: Session = Depends(get_db)):
    grouped_components = {}
    for va_component in crud.get_virtual_assistant_components_by_name(db, dist_name):
        if va_component.component.group not in grouped_components:
            grouped_components[va_component.component.group] = []

        grouped_components[va_component.component.group].append(
            _virtual_assistant_component_model_to_schema(va_component)
        )

    return schemas.VirtualAssistantComponentPipelineRead(**grouped_components)


@assistant_dists_router.post("/{dist_name}/components", status_code=status.HTTP_201_CREATED)
async def add_virtual_assistant_component(
    dist_name: str, payload: schemas.CreateVirtualAssistantComponentRequest, db: Session = Depends(get_db)
):
    """"""
    with db.begin():
        virtual_assistant = crud.get_virtual_assistant_by_name(db, dist_name)
        dream_dist = AssistantDist.from_dist(settings.db.dream_root_path / virtual_assistant.source)

        virtual_assistant_component = crud.create_virtual_assistant_component(
            db, virtual_assistant.id, payload.component_id
        )
        dream_dist.add_generative_prompted_skill(
            DreamComponent.from_file(virtual_assistant_component.component.source, settings.db.dream_root_path)
        )
        dream_dist.save(overwrite=True, generate_configs=True)

    return _virtual_assistant_component_model_to_schema(virtual_assistant_component)


@assistant_dists_router.patch(
    "/{dist_name}/components/{virtual_assistant_component_id}", status_code=status.HTTP_200_OK
)
async def patch_virtual_assistant_component(
    dist_name: str, virtual_assistant_component_id: int, db: Session = Depends(get_db)
):
    """"""


@assistant_dists_router.delete(
    "/{dist_name}/components/{virtual_assistant_component_id}", status_code=status.HTTP_204_NO_CONTENT
)
async def delete_virtual_assistant_component(
    dist_name: str, virtual_assistant_component_id: int, db: Session = Depends(get_db)
):
    """"""
    with db.begin():
        virtual_assistant = crud.get_virtual_assistant_by_name(db, dist_name)
        dream_dist = AssistantDist.from_dist(settings.db.dream_root_path / virtual_assistant.source)

        virtual_assistant_component = crud.get_virtual_assistant_component(db, virtual_assistant_component_id)
        dream_dist.remove_generative_prompted_skill(virtual_assistant_component.component.name)
        dream_dist.save(overwrite=True, generate_configs=True)

        crud.delete_virtual_assistant_component(db, virtual_assistant_component_id)


@assistant_dists_router.post("/{dist_name}/publish", status_code=status.HTTP_204_NO_CONTENT)
async def publish_dist(
    dist_name: str,
    payload: schemas.PublishRequestCreate,
    background_tasks: BackgroundTasks,
    user: schemas.UserRead = Depends(verify_token),
    db: Session = Depends(get_db),
):
    with db.begin():
        virtual_assistant = crud.get_virtual_assistant_by_name(db, dist_name)
        dist = AssistantDist.from_dist(settings.db.dream_root_path / virtual_assistant.source)

        if payload.visibility.__class__ == enums.VirtualAssistantPrivateVisibility:
            crud.delete_publish_request(db, virtual_assistant.id)
            virtual_assistant = crud.update_virtual_assistant_by_name(
                db, dist_name, private_visibility=payload.visibility
            )
        elif payload.visibility.__class__ == enums.VirtualAssistantPublicVisibility:
            crud.create_publish_request(db, virtual_assistant.id, user.id, virtual_assistant.name, payload.visibility)
            moderators = crud.get_users_by_role(db, 2)

            background_tasks.add_task(
                send_publish_request_created_emails,
                owner_email=user.email,
                moderator_emails=[m.email for m in moderators],
                virtual_assistant_name=virtual_assistant.name,
                virtual_assistant_display_name=virtual_assistant.display_name,
            )


@assistant_dists_router.get("/templates/{template_file_path}")
async def debug_template(template_file_path: str, owner_address: str, dist_name: str):
    from services.distributions_api.utils.emailer import env
    from starlette.templating import _TemplateResponse

    template = env.get_template(f"{template_file_path}.html")
    template_kwargs = {
        "owner_address": owner_address,
        "dist_name": dist_name,
    }

    return _TemplateResponse(template, template_kwargs)


# @assistant_dists_router.get("/{dist_name}/components/{component_group}")
# async def get_config_services_by_group(dist_name: str, component_group: str, token: str = Depends(verify_token)):
#     dist = AssistantDist.from_name(name=dist_name, dream_root=DREAM_ROOT_PATH)
#     return list(_component_to_component_short(c) for c in dist.iter_components(component_group))
#
#
# @assistant_dists_router.post("/{dist_name}/add_service/", status_code=status.HTTP_201_CREATED)
# async def add_service_to_dist(dist_name: str, service_name: str, port: int, token: str = Depends(verify_token)):
#     """ """
#     dream_dist = AssistantDist.from_name(name=dist_name, dream_root=DREAM_ROOT_PATH)
#     dream_dist.add_service(name=service_name, port=port)
#
#     dream_dist.save(overwrite=True)
#     return _dist_to_distmodel(dream_dist)
#
#
# @assistant_dists_router.post("/{dist_name}/remove_service", status_code=status.HTTP_200_OK)
# async def remove_service_from_dist(dist_name: str, service_name: str, token: str = Depends(verify_token)):
#     """ """
#     dream_dist = AssistantDist.from_name(name=dist_name, dream_root=DREAM_ROOT_PATH)
#     dream_dist.remove_service(service_name, inplace=True)
#
#     dream_dist.save(overwrite=True)
#     return _dist_to_distmodel(dream_dist)
