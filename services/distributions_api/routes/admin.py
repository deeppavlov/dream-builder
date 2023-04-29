from deeppavlov_dreamtools import AssistantDist
from fastapi import APIRouter, Depends, BackgroundTasks
from sqlalchemy.orm import Session
from starlette import status

from apiconfig.config import settings
from database import crud
from services.distributions_api import schemas
from services.distributions_api.database_maker import get_db
from services.distributions_api.security.auth import verify_token
from services.distributions_api.utils.emailer import Emailer

admin_router = APIRouter(prefix="/api/admin", tags=["admin"])


def send_publish_request_reviewed_emails(owner_email: str, virtual_assistant_display_name: str, is_confirmed: bool):
    emailer = Emailer(settings.smtp.server, settings.smtp.port, settings.smtp.user, settings.smtp.password)

    if is_confirmed:
        emailer.send_publish_request_confirmed_to_owner(owner_email, virtual_assistant_display_name)
    else:
        emailer.send_publish_request_declined_to_owner(owner_email, virtual_assistant_display_name)


@admin_router.get("/publish_request", status_code=status.HTTP_200_OK)
async def get_all_publish_requests(
    user: schemas.UserRead = Depends(verify_token), db: Session = Depends(get_db)
) -> [schemas.PublishRequestRead]:
    return [schemas.PublishRequestRead.from_orm(pr) for pr in crud.get_all_publish_requests(db)]


@admin_router.get("/publish_request/unreviewed", status_code=status.HTTP_200_OK)
async def get_unreviewed_publish_requests(
    user: schemas.UserRead = Depends(verify_token), db: Session = Depends(get_db)
) -> [schemas.PublishRequestRead]:
    return [schemas.PublishRequestRead.from_orm(pr) for pr in crud.get_unreviewed_publish_requests(db)]


@admin_router.post("/publish_request/{publish_request_id}/confirm", status_code=status.HTTP_200_OK)
async def confirm_publish_request(
    publish_request_id: int,
    background_tasks: BackgroundTasks,
    user: schemas.UserRead = Depends(verify_token),
    db: Session = Depends(get_db),
) -> schemas.PublishRequestRead:
    with db.begin():
        publish_request = crud.confirm_publish_request(db, publish_request_id, user.id)
        background_tasks.add_task(
            send_publish_request_reviewed_emails,
            owner_email=publish_request.user.email,
            virtual_assistant_display_name=publish_request.virtual_assistant.display_name,
            is_confirmed=True,
        )

    return schemas.PublishRequestRead.from_orm(publish_request)


@admin_router.post("/publish_request/{publish_request_id}/decline", status_code=status.HTTP_200_OK)
async def decline_publish_request(
    publish_request_id: int,
    background_tasks: BackgroundTasks,
    user: schemas.UserRead = Depends(verify_token),
    db: Session = Depends(get_db),
) -> schemas.PublishRequestRead:
    with db.begin():
        publish_request = crud.decline_publish_request(db, publish_request_id, user.id)
        background_tasks.add_task(
            send_publish_request_reviewed_emails,
            owner_email=publish_request.user.email,
            virtual_assistant_display_name=publish_request.virtual_assistant.display_name,
            is_confirmed=False,
        )

    return schemas.PublishRequestRead.from_orm(publish_request)
