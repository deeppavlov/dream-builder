import secrets
from typing import List

from deeppavlov_dreamtools.distconfigs.assistant_dists import AssistantDist
from deeppavlov_dreamtools.distconfigs.generics import Component
from deeppavlov_dreamtools.distconfigs.pipeline import Pipeline
from deeppavlov_dreamtools.utils import parse_connector_url
from fastapi import APIRouter, status, Depends, HTTPException
from fastapi.logger import logger
from sqlalchemy.orm import Session

from apiconfig.config import settings
from database import crud
from services.distributions_api import schemas
from services.distributions_api.const import DREAM_ROOT_PATH, TEMPLATE_DIST_PROMPT_BASED
from services.distributions_api.database_maker import get_db
from services.distributions_api.schemas import (
    AssistantDistModel,
    AssistantDistModelShort,
    CreateAssistantDistModel,
    ComponentShort,
    DistComponentsResponse,
)
from services.distributions_api.security.auth import verify_token
from services.distributions_api.utils.emailer import Emailer

assistant_dists_router = APIRouter(prefix="/api/assistant_dists", tags=["assistant_dists"])


emailer = Emailer(settings.smtp.server, settings.smtp.port, settings.smtp.user, settings.smtp.password)


def _generate_name_from_display_name(display_name: str):
    """Generates unique snake_case name from human-readable name

    Args:
        display_name: assistant dist display name

    Returns:
        assistant dist name in snake_case with unique identifier
    """
    normalized_name = "".join(
        char for char in display_name.replace(" ", "_").lower() if char.isalnum() or char in ["_"]
    )
    random_id = secrets.token_hex(4)

    return f"{normalized_name}_{random_id}"


def _dist_to_dist_model_short(dream_dist: AssistantDist) -> AssistantDistModelShort:
    """Creates a pydantic object with minimal distribution description

    Args:
        dream_dist: AssistantDist object

    Returns:
        Pydantic object with distribution description
    """
    return AssistantDistModelShort(
        name=dream_dist.name,
        **dream_dist.pipeline_conf.config.metadata.dict(),
    )


def _dist_to_dist_model(dream_dist: AssistantDist) -> AssistantDistModel:
    """Creates a pydantic object with extended distribution description

    Args:
        dream_dist: AssistantDist object

    Returns:
        Pydantic object with distribution description
    """
    return AssistantDistModel(
        dist_path=str(dream_dist.dist_path),
        name=dream_dist.name,
        dream_root=str(dream_dist.dream_root),
        pipeline_conf=dream_dist.pipeline_conf.config if dream_dist.pipeline_conf else None,
        compose_override=dream_dist.compose_override.config if dream_dist.compose_override else None,
        compose_dev=dream_dist.compose_dev.config if dream_dist.compose_dev else None,
        compose_proxy=dream_dist.compose_proxy.config if dream_dist.compose_proxy else None,
    )


# def _dist_model_to_dist(dream_dist_model: AssistantDistModel) -> AssistantDist:
#     """Creates AssistantDist object from pydantic distribution object
#
#     Args:
#         dream_dist_model: AssistantDist object
#
#     Returns:
#         AssistantDist object
#     """
#     return AssistantDist(
#         dist_path=dream_dist_model.dist_path,
#         name=dream_dist_model.name,
#         dream_root=dream_dist_model.dream_root,
#         pipeline_conf=DreamPipeline(dream_dist_model.pipeline_conf),
#         compose_override=DreamComposeOverride(dream_dist_model.compose_override),
#         compose_dev=DreamComposeDev(dream_dist_model.compose_dev),
#         compose_proxy=DreamComposeProxy(dream_dist_model.compose_proxy),
#     )


def _component_to_component_short(component: Component) -> ComponentShort:
    component_dict = component.dict(exclude_none=True)

    if component.container_name.endswith("prompted-skill") and component.build_args.get("GENERATIVE_SERVICE_URL"):
        lm_service_url = component.build_args["GENERATIVE_SERVICE_URL"]
        lm_service_host, _, _ = parse_connector_url(lm_service_url)
        lm_name_map = {
            "transformers-lm-gptj": "GPT-J 6B",
            "transformers-lm-bloomz7b": "BLOOMZ 7B",
            "openai-api-davinci3": "GPT-3.5",
            "openai-api-chatgpt": "ChatGPT",
        }
        lm_service_display_name = lm_name_map.get(lm_service_host)
        if lm_service_display_name:
            component_dict["lm_service"] = lm_service_display_name

    return ComponentShort(**component_dict)


def _pipeline_to_dist_component_response(pipeline: Pipeline) -> DistComponentsResponse:
    all_components = {}

    for group_name in [
        "annotators",
        "skill_selectors",
        "skills",
        "candidate_annotators",
        "response_selectors",
        "response_annotators",
    ]:
        group = getattr(pipeline, group_name, {})
        group_components = []

        if group:
            for name, component in group.items():
                component_short = _component_to_component_short(component.config)
                group_components.append(component_short)

        all_components[group_name] = group_components

    return DistComponentsResponse(**all_components)


@assistant_dists_router.post("/", status_code=status.HTTP_201_CREATED)
async def create_distribution(
    payload: CreateAssistantDistModel, user: schemas.User = Depends(verify_token), db: Session = Depends(get_db)
) -> schemas.VirtualAssistant:
    """
    Creates new distribution from base template

    **Payload args**

    -``display_name``: new assistant dist display name

    -``description``: new assistant dist description
    """
    dream_dist = AssistantDist.from_name(TEMPLATE_DIST_PROMPT_BASED, DREAM_ROOT_PATH)
    new_name = _generate_name_from_display_name(payload.display_name)

    with db.begin():
        new_dist = dream_dist.clone(new_name, payload.display_name, payload.description)
        new_dist.save()

        new_dist_db_row = crud.create_virtual_assistant(
            db,
            user.id,
            str(new_dist.dist_path),
            new_dist.name,
            payload.display_name,
            payload.description,
        )

    return schemas.VirtualAssistant.from_orm(new_dist_db_row)


@assistant_dists_router.get("/public", status_code=status.HTTP_200_OK)
async def get_list_of_public_distributions(db: Session = Depends(get_db)) -> List[schemas.VirtualAssistant]:
    """
    Lists public Dream distributions
    """
    public_dists = []

    for dist in crud.get_all_public_virtual_assistants(db):
        if dist.name not in ["universal_prompted_assistant", "deepy_assistant", "dream_persona_openai_prompted"]:
            public_dists.append(schemas.VirtualAssistant.from_orm(dist))

    return public_dists


@assistant_dists_router.get("/private", status_code=status.HTTP_200_OK)
async def get_list_of_private_distributions(
    user: schemas.User = Depends(verify_token), db: Session = Depends(get_db)
) -> List[schemas.VirtualAssistant]:
    """
    Lists private Dream distributions

    **Header args**

    -``token``: auth token
    """
    public_dists = []

    for dist in crud.get_all_private_virtual_assistants(db, user.id):
        if dist.name not in ["universal_prompted_assistant", "deepy_assistant", "dream_persona_openai_prompted"]:
            public_dists.append(schemas.VirtualAssistant.from_orm(dist))

    return public_dists


@assistant_dists_router.get("/{dist_name}", status_code=status.HTTP_200_OK)
async def get_dist_by_name(dist_name: str, db: Session = Depends(get_db)) -> schemas.VirtualAssistant:
    """
    Returns existing dist with the given name

    **Path args**

    -``dist_name``: name of the distribution
    """
    virtual_assistant = crud.get_virtual_assistant_by_name(db, dist_name)

    try:
        dream_dist = AssistantDist.from_dist(virtual_assistant.source)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail=f"Virtual assistant '{DREAM_ROOT_PATH}/{dist_name}' not found")

    return schemas.VirtualAssistant.from_orm(virtual_assistant)


@assistant_dists_router.patch("/{dist_name}", status_code=status.HTTP_200_OK)
async def patch_dist_by_name(
    dist_name: str,
    payload: schemas.EditAssistantDistModel,
    user: str = Depends(verify_token),
    db: Session = Depends(get_db),
) -> schemas.VirtualAssistant:
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
        dream_dist = AssistantDist.from_dist(virtual_assistant.source)

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

    return schemas.VirtualAssistant.from_orm(virtual_assistant)


@assistant_dists_router.delete("/{dist_name}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_dist_by_name(
    dist_name: str, user: schemas.User = Depends(verify_token), db: Session = Depends(get_db)
):
    """
    Deletes existing dist

    **Header args**

    -``token``: auth token

    **Path args**

    -``dist_name``: name of the distribution
    """
    with db.begin():
        try:
            dream_dist = AssistantDist.from_name(name=dist_name, dream_root=DREAM_ROOT_PATH)
            dream_dist.delete()
        except FileNotFoundError:
            pass

        crud.delete_virtual_assistant_by_name(db, dist_name)


@assistant_dists_router.post("/{dist_name}/clone", status_code=status.HTTP_201_CREATED)
async def clone_dist(
    dist_name: str,
    payload: schemas.CreateAssistantDistModel,
    user: schemas.User = Depends(verify_token),
    db: Session = Depends(get_db),
) -> schemas.VirtualAssistant:
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
    dream_dist = AssistantDist.from_name(dist_name, DREAM_ROOT_PATH)
    new_name = _generate_name_from_display_name(payload.display_name)

    with db.begin():
        new_dist = dream_dist.clone(new_name, payload.display_name, payload.description)
        new_dist.save(overwrite=False)

        original_dist_db_row = crud.get_virtual_assistant_by_name(db, dist_name)
        new_dist_db_row = crud.create_virtual_assistant(
            db,
            user.id,
            str(new_dist.dist_path),
            new_dist.name,
            payload.display_name,
            payload.description,
            cloned_from_id=original_dist_db_row.id,
        )

        try:
            crud.create_deployment_from_copy(db, original_dist_db_row.id, new_dist_db_row.id)
        except ValueError:
            crud.create_deployment(db, new_dist_db_row.id, "http://test-url", "test prompt", 1)

    return schemas.VirtualAssistant.from_orm(new_dist_db_row)


@assistant_dists_router.get("/{dist_name}/components/", status_code=status.HTTP_200_OK)
async def get_dist_components(dist_name: str, db: Session = Depends(get_db)):
    grouped_components = {}
    for va_component in crud.get_virtual_assistant_components_by_name(db, dist_name):
        if va_component.component.group not in grouped_components:
            grouped_components[va_component.component.group] = []

        grouped_components[va_component.component.group].append(ComponentShort.from_orm(va_component.component))

    return schemas.DistComponentsResponse(**grouped_components)


@assistant_dists_router.post("/{dist_name}/publish/", status_code=status.HTTP_204_NO_CONTENT)
async def publish_dist(dist_name: str, payload: schemas.CreatePublishRequest, user: schemas.User = Depends(verify_token), db: Session = Depends(get_db)):
    with db.begin():
        virtual_assistant = crud.get_virtual_assistant_by_name(db, dist_name)
        dist = AssistantDist.from_dist(virtual_assistant.source)

        crud.create_publish_request(db, virtual_assistant.id, user.id, virtual_assistant.name)
        moderators = crud.get_users_by_role(db, 2)

        for moderator in moderators:
            emailer.send_publish_request_to_moderators(
                moderator.email, user.email, virtual_assistant.name, virtual_assistant.display_name
            )
        emailer.send_publish_request_to_owner(user.email, virtual_assistant.display_name)

    logger.info(f"Sent publish request")


@assistant_dists_router.get("/{dist_name}/prompt", status_code=status.HTTP_200_OK)
async def get_dist_prompt(dist_name: str, user: schemas.User = Depends(verify_token), db: Session = Depends(get_db)):
    prompt = crud.get_deployment_prompt_by_virtual_assistant_name(db, dist_name)
    return schemas.Prompt(text=prompt)


@assistant_dists_router.post("/{dist_name}/prompt", status_code=status.HTTP_200_OK)
async def set_dist_prompt(
    dist_name: str, payload: schemas.Prompt, user: schemas.User = Depends(verify_token), db: Session = Depends(get_db)
):
    deployment = crud.set_deployment_prompt_by_virtual_assistant_name(db, dist_name, payload.text)
    return schemas.Deployment.from_orm(deployment)


@assistant_dists_router.get("/{dist_name}/lm_service", status_code=status.HTTP_200_OK)
async def get_dist_lm_service(
    dist_name: str, user: schemas.User = Depends(verify_token), db: Session = Depends(get_db)
):
    try:
        lm_service = crud.get_deployment_lm_service_by_virtual_assistant_name(db, dist_name)
    except ValueError:
        raise HTTPException(status_code=404, detail=f"No deployments for virtual assistant {dist_name}")

    return schemas.LmService.from_orm(lm_service)


@assistant_dists_router.post("/{dist_name}/lm_service", status_code=status.HTTP_200_OK)
async def set_dist_lm_service(
    dist_name: str,
    payload: schemas.SetLmServiceRequest,
    user: dict = Depends(verify_token),
    db: Session = Depends(get_db),
):
    deployment = crud.set_deployment_lm_service_by_virtual_assistant_name(db, dist_name, payload.name)
    return schemas.Deployment.from_orm(deployment)


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
