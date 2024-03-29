from fastapi import APIRouter, Depends, BackgroundTasks
from sqlalchemy.orm import Session
from starlette import status

from apiconfig.config import settings
from database.models.publish_request import crud as publish_request_crud
from database.models.github_user import crud as github_user_crud
from database.models.google_user import crud as google_user_crud
from services.distributions_api import schemas
from services.distributions_api.database_maker import get_db
from services.distributions_api.security.auth import get_admin_user
from services.distributions_api.utils.emailer import Emailer

admin_router = APIRouter(prefix="/api/admin", tags=["admin"])


def send_publish_request_reviewed_emails(
    owner_email: str,
    owner_name: str,
    virtual_assistant_display_name: str,
    virtual_assistant_url: str,
    is_confirmed: bool,
):
    emailer = Emailer(
        settings.smtp.server, settings.smtp.port, settings.smtp.user, settings.smtp.password, settings.smtp.login_policy
    )

    if is_confirmed:
        emailer.send_publish_request_confirmed_to_owner(
            owner_email, owner_name, virtual_assistant_display_name, virtual_assistant_url
        )
    else:
        emailer.send_publish_request_declined_to_owner(owner_email, owner_name, virtual_assistant_display_name)


@admin_router.get("/publish_request", status_code=status.HTTP_200_OK)
async def get_all_publish_requests(user: schemas.UserRead = Depends(get_admin_user), db: Session = Depends(get_db)):
    return [schemas.PublishRequestRead.from_orm(pr) for pr in publish_request_crud.get_all_publish_requests(db)]


@admin_router.get("/publish_request/unreviewed", status_code=status.HTTP_200_OK)
async def get_unreviewed_publish_requests(
    user: schemas.UserRead = Depends(get_admin_user), db: Session = Depends(get_db)
):
    return [schemas.PublishRequestRead.from_orm(pr) for pr in publish_request_crud.get_unreviewed_publish_requests(db)]


@admin_router.post("/publish_request/{publish_request_id}/confirm", status_code=status.HTTP_200_OK)
async def confirm_publish_request(
    publish_request_id: int,
    background_tasks: BackgroundTasks,
    user: schemas.UserRead = Depends(get_admin_user),
    db: Session = Depends(get_db),
) -> schemas.PublishRequestRead:
    with db.begin():
        publish_request = publish_request_crud.approve_publish_request(db, publish_request_id, user.id)
        is_github_user = github_user_crud.check_user_exists(db, publish_request.user.outer_id)
        if is_github_user:
            desired_user = github_user_crud.get_by_outer_id(db, publish_request.user.outer_id)
            publish_request.user.email = desired_user.email
            publish_request.user.name = desired_user.name
        else:
            is_google_user = google_user_crud.check_user_exists(db, publish_request.user.outer_id)
            if is_google_user:
                desired_user = google_user_crud.get_by_outer_id(db, publish_request.user.outer_id)
                publish_request.user.email = desired_user.email
                publish_request.user.name = desired_user.fullname
        background_tasks.add_task(
            send_publish_request_reviewed_emails,
            owner_email=publish_request.user.email,
            owner_name=publish_request.user.name,
            virtual_assistant_display_name=publish_request.virtual_assistant.display_name,
            virtual_assistant_url=publish_request.virtual_assistant.name,
            is_confirmed=True,
        )

    return schemas.PublishRequestRead.from_orm(publish_request)


@admin_router.post("/publish_request/{publish_request_id}/decline", status_code=status.HTTP_200_OK)
async def decline_publish_request(
    publish_request_id: int,
    background_tasks: BackgroundTasks,
    user: schemas.UserRead = Depends(get_admin_user),
    db: Session = Depends(get_db),
) -> schemas.PublishRequestRead:
    with db.begin():
        publish_request = publish_request_crud.reject_publish_request(db, publish_request_id, user.id)
        is_github_user = github_user_crud.check_user_exists(db, publish_request.user.outer_id)
        if is_github_user:
            desired_user = github_user_crud.get_by_outer_id(db, publish_request.user.outer_id)
            publish_request.user.email = desired_user.email
        else:
            is_google_user = google_user_crud.check_user_exists(db, publish_request.user.outer_id)
            if is_google_user:
                desired_user = google_user_crud.get_by_outer_id(db, publish_request.user.outer_id)
                publish_request.user.email = desired_user.email
        background_tasks.add_task(
            send_publish_request_reviewed_emails,
            owner_email=publish_request.user.email,
            virtual_assistant_display_name=publish_request.virtual_assistant.display_name,
            virtual_assistant_url=publish_request.virtual_assistant.name,
            is_confirmed=False,
        )

    return schemas.PublishRequestRead.from_orm(publish_request)
