from deeppavlov_dreamtools import AssistantDist
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from starlette import status

from apiconfig.config import settings
from database import crud
from services.distributions_api import schemas
from services.distributions_api.database_maker import get_db
from services.distributions_api.security.auth import verify_token

deployments_router = APIRouter(prefix="/api/deployments", tags=["deployments"])


# deployer = Deployer(settings.deployer.portainer_key)


@deployments_router.post("/")
async def create_deployment(
    payload: schemas.DeploymentCreate, user: schemas.User = Depends(verify_token), db: Session = Depends(get_db)
):
    with db.begin():
        virtual_assistant = crud.get_virtual_assistant(db, payload.virtual_assistant_id)
        dream_dist = AssistantDist.from_dist(settings.db.dream_root_path / virtual_assistant.source)

        # chat_url = deployer.deploy(dream_dist)
        # deployment = crud.create_deployment(db, virtual_assistant.id, chat_url)

    # return schemas.Deployment.from_orm(deployment)


@deployments_router.get("/lm_services", status_code=status.HTTP_200_OK)
async def get_all_lm_services(db: Session = Depends(get_db)):
    """ """
    return [schemas.LmService.from_orm(name) for name in crud.get_all_lm_services(db)]


# @deployments_router.get("/{dialog_session_id}", status_code=status.HTTP_200_OK)
# async def get_dialog_session(
#     dialog_session_id: int,
#     user: schemas.User = Depends(verify_token),
#     db: Session = Depends(get_db),
# ):
#     """
#
#     Returns:
#
#     """
#     return schemas.DialogSession(id=1, user_id=1, virtual_assistant_id=1, is_active=True)
#
#
# @deployments_router.post("/{dialog_session_id}/chat", status_code=status.HTTP_201_CREATED)
# async def send_dialog_session_message(
#     dialog_session_id: int,
#     payload: schemas.DialogChatMessageRequest,
#     user: schemas.User = Depends(verify_token),
#     db: Session = Depends(get_db),
# ):
#     """
#     text
#
#     Returns:
#
#     """
#     bot_response = f"This is a bot response to '{payload.text}'"
#
#     debug_chat.history.append(schemas.DialogUtterance(author="user", text=payload.text))
#     debug_chat.history.append(schemas.DialogUtterance(author="bot", text=bot_response))
#     return schemas.DialogChatMessageResponse(text=bot_response)
#
#
# @deployments_router.get("/{dialog_session_id}/history", status_code=status.HTTP_200_OK)
# async def get_dialog_session_history(
#     dialog_session_id: int,
#     user: schemas.User = Depends(verify_token),
#     db: Session = Depends(get_db),
# ):
#     """
#
#     Returns:
#
#     """
#     return debug_chat.history
