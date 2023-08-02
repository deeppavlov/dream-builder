from typing import List

from fastapi import APIRouter, status, Depends, BackgroundTasks, HTTPException
from sqlalchemy.orm import Session

from apiconfig.config import settings
from database.models.user import crud as user_crud
from database.models.virtual_assistant.crud import get_all_public_templates, get_all_by_author
from database.models.virtual_assistant_component import crud as virtual_assistant_component_crud
from services.distributions_api import schemas, const
from services.distributions_api.const import TEMPLATE_DIST_PROMPT_BASED
from services.distributions_api.database_maker import get_db
from services.distributions_api.routes.assistant_dists import flows
from services.distributions_api.routes.assistant_dists.dependencies import (
    virtual_assistant_view_permission,
    virtual_assistant_patch_permission,
    virtual_assistant_delete_permission,
)
from services.distributions_api.security.auth import get_current_user
from services.distributions_api.utils.emailer import Emailer

assistant_dists_router = APIRouter(prefix="/api/assistant_dists", tags=["assistant_dists"])


def send_publish_request_created_emails(
    owner_email: str, owner_name: str, moderator_emails: List[str], virtual_assistant_name: str, virtual_assistant_display_name: str
):
    emailer = Emailer(settings.smtp.server, settings.smtp.port, settings.smtp.user, settings.smtp.password, settings.smtp.login_policy)

    for moderator_email in moderator_emails:
        emailer.send_publish_request_created_to_moderators(
            moderator_email, owner_email, virtual_assistant_name, virtual_assistant_display_name
        )
    emailer.send_publish_request_created_to_owner(owner_email, owner_name, virtual_assistant_display_name)


@assistant_dists_router.post("", status_code=status.HTTP_201_CREATED)
async def create_virtual_assistant(
    payload: schemas.VirtualAssistantCreate,
    user: schemas.UserRead = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> schemas.VirtualAssistantRead:
    """
    Creates new distribution from base template

    **Payload args**

    -``display_name``: new assistant dist display name

    -``description``: new assistant dist description
    """
    try:
        template_dist = TEMPLATE_DIST_PROMPT_BASED[payload.language]
    except KeyError:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=f"No template for language {payload.language}"
        )

    new_virtual_assistant = flows.create_virtual_assistant(
        db,
        template_dist,
        payload.display_name,
        payload.description,
        user.id,
        user.email,
        payload.language,
    )
    return new_virtual_assistant


@assistant_dists_router.get("/public_templates", status_code=status.HTTP_200_OK)
async def get_list_of_public_virtual_assistants(db: Session = Depends(get_db)) -> List[schemas.VirtualAssistantRead]:
    """
    Lists public Dream distributions
    """
    public_dists = []

    for dist in get_all_public_templates(db):
        public_dists.append(schemas.VirtualAssistantRead.from_orm(dist))

    return public_dists


@assistant_dists_router.get("/user_owned", status_code=status.HTTP_200_OK)
async def get_list_of_private_virtual_assistants(
    user: schemas.UserRead = Depends(get_current_user), db: Session = Depends(get_db)
) -> List[schemas.VirtualAssistantRead]:
    """
    Lists private Dream distributions

    **Header args**

    -``token``: auth token
    """
    private_dists = []

    for dist in get_all_by_author(db, user.id):
        private_dists.append(schemas.VirtualAssistantRead.from_orm(dist))

    return private_dists


@assistant_dists_router.get("/{dist_name}", status_code=status.HTTP_200_OK, dependencies=[])
async def get_virtual_assistant_by_name(
    virtual_assistant: schemas.VirtualAssistantRead = Depends(virtual_assistant_view_permission),
) -> schemas.VirtualAssistantRead:
    """
    Returns existing dist with the given name

    **Path args**

    -``dist_name``: name of the distribution
    """

    return virtual_assistant


@assistant_dists_router.patch("/{dist_name}", status_code=status.HTTP_200_OK)
async def patch_virtual_assistant_by_name(
    payload: schemas.VirtualAssistantUpdate,
    virtual_assistant: schemas.VirtualAssistantRead = Depends(virtual_assistant_patch_permission),
    user: schemas.UserRead = Depends(get_current_user),
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
    new_virtual_assistant = flows.patch_virtual_assistant(
        db, virtual_assistant, user.id, payload.display_name, payload.description
    )
    return new_virtual_assistant


@assistant_dists_router.delete("/{dist_name}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_virtual_assistant_by_name(
    virtual_assistant: schemas.VirtualAssistantRead = Depends(virtual_assistant_delete_permission),
    user: schemas.UserRead = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Deletes existing dist

    **Header args**

    -``token``: auth token

    **Path args**

    -``dist_name``: name of the distribution
    """
    flows.delete_virtual_assistant(db, virtual_assistant, user.id)


@assistant_dists_router.post("/{dist_name}/clone", status_code=status.HTTP_201_CREATED)
async def clone_dist(
    payload: schemas.VirtualAssistantCreate,
    virtual_assistant: schemas.VirtualAssistantRead = Depends(virtual_assistant_view_permission),
    user: schemas.UserRead = Depends(get_current_user),
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
    new_virtual_assistant = flows.create_virtual_assistant(
        db,
        virtual_assistant.name,
        payload.display_name,
        payload.description,
        user.id,
        user.email,
        payload.language,
        is_cloned=True,
    )
    return new_virtual_assistant


@assistant_dists_router.get("/{dist_name}/components", status_code=status.HTTP_200_OK)
async def get_virtual_assistant_components(
    virtual_assistant: schemas.VirtualAssistantRead = Depends(virtual_assistant_view_permission),
    db: Session = Depends(get_db),
):
    grouped_components = {}
    for va_component in virtual_assistant_component_crud.get_all_by_virtual_assistant_name(db, virtual_assistant.name):
        if va_component.component.group not in grouped_components:
            grouped_components[va_component.component.group] = []

        grouped_components[va_component.component.group].append(
            schemas.VirtualAssistantComponentRead.from_orm(va_component)
        )

    return schemas.VirtualAssistantComponentPipelineRead(**grouped_components)


@assistant_dists_router.post("/{dist_name}/components", status_code=status.HTTP_201_CREATED)
async def add_virtual_assistant_component(
    payload: schemas.CreateVirtualAssistantComponentRequest,
    virtual_assistant: schemas.VirtualAssistantRead = Depends(virtual_assistant_patch_permission),
    db: Session = Depends(get_db),
):
    """"""
    virtual_assistant_component = flows.add_virtual_assistant_component(db, virtual_assistant, payload.component_id)
    return virtual_assistant_component


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
    virtual_assistant_component_id: int,
    virtual_assistant: schemas.VirtualAssistantRead = Depends(virtual_assistant_patch_permission),
    db: Session = Depends(get_db),
):
    """"""
    flows.delete_virtual_assistant_component(db, virtual_assistant, virtual_assistant_component_id)


@assistant_dists_router.post("/{dist_name}/publish", status_code=status.HTTP_204_NO_CONTENT)
async def publish_dist(
    payload: schemas.PublishRequestCreate,
    background_tasks: BackgroundTasks,
    virtual_assistant: schemas.VirtualAssistantRead = Depends(virtual_assistant_patch_permission),
    user: schemas.UserRead = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    flows.publish_virtual_assistant(db, virtual_assistant, payload.visibility, user.id)

    background_tasks.add_task(
        send_publish_request_created_emails,
        owner_email=user.email,
        owner_name=user.fullname,
        moderator_emails=[m.email for m in user_crud.get_by_role(db, 2)],
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
