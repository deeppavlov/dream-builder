import aiohttp
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from starlette import status

from apiconfig.config import settings
from database import crud
from services.distributions_api import schemas
from services.distributions_api.database_maker import get_db
from services.distributions_api.security.auth import verify_token

dialog_sessions_router = APIRouter(prefix="/api/dialog_sessions", tags=["dialog_sessions"])


async def send_chat_request_to_deployed_agent(agent_url: str, session_id: int, text: str, prompt: str, lm_service: str):
    """ """
    data = {
        "user_id": f"{settings.app.agent_user_id_prefix}_{session_id}",
        "payload": text,
        "prompt": prompt,
        "lm_service": lm_service,
    }
    async with aiohttp.ClientSession() as session:
        async with session.post(agent_url, json=data) as response:
            response_data = await response.json()

    if response.status != 200:
        raise ValueError(f"Agent {agent_url} did not respond correctly. Response: {response}")

    try:
        dialog_id, response_text = response_data["dialog_id"], response_data["response"]
    except KeyError:
        raise ValueError(f"No 'response' and 'dialog_id' fields in agent response. Response: {response}")

    return dialog_id, response_text


async def send_history_request_to_deployed_agent(agent_history_url: str, dialog_id: str):
    """ """
    async with aiohttp.ClientSession() as session:
        async with session.get(f"{agent_history_url}/api/dialogs/{dialog_id}") as response:
            response_data = await response.json()

    history = []

    if response.status != 200:
        raise ValueError(f"Agent {agent_history_url} did not respond correctly. Response: {response}")

    try:
        response_utterances = response_data["utterances"]
    except KeyError:
        raise ValueError(f"No response field in agent response. Response: {response}")
    else:
        for utterance in response_utterances:
            if utterance["user"].get("user_type") == "human":
                author = "user"
            else:
                author = "bot"

            text = utterance["text"]

            history.append({"author": author, "text": text})

    return history


@dialog_sessions_router.post("/", status_code=status.HTTP_201_CREATED)
async def create_dialog_session(
    payload: schemas.CreateDialogSessionRequest,
    user: schemas.User = Depends(verify_token),
    db: Session = Depends(get_db),
):
    """ """
    dialog_session = crud.create_dialog_session_by_name(db, user.id, payload.virtual_assistant_name)
    return schemas.DialogSession.from_orm(dialog_session)


@dialog_sessions_router.get("/{dialog_session_id}", status_code=status.HTTP_200_OK)
async def get_dialog_session(
    dialog_session_id: int,
    user: schemas.User = Depends(verify_token),
    db: Session = Depends(get_db),
):
    """ """
    dialog_session = crud.get_dialog_session(db, dialog_session_id)
    return schemas.DialogSession.from_orm(dialog_session)


@dialog_sessions_router.post("/{dialog_session_id}/chat", status_code=status.HTTP_201_CREATED)
async def send_dialog_session_message(
    dialog_session_id: int,
    payload: schemas.DialogChatMessageRequest,
    user: schemas.User = Depends(verify_token),
    db: Session = Depends(get_db),
):
    """
    text
    """
    dialog_session = crud.get_dialog_session(db, dialog_session_id)
    virtual_assistant = crud.get_virtual_assistant(db, dialog_session.deployment.virtual_assistant_id)

    if virtual_assistant.publish_request is not None:
        chat_url = dialog_session.deployment.chat_url
    else:
        chat_url = "http://54.234.141.146:4249"

    lm_service = None
    if dialog_session.deployment.lm_service:
        lm_service = dialog_session.deployment.lm_service.display_name

    agent_dialog_id, bot_response = await send_chat_request_to_deployed_agent(
        chat_url,
        dialog_session.id,
        payload.text,
        dialog_session.deployment.prompt,
        lm_service,
    )

    crud.update_dialog_session(db, dialog_session.id, agent_dialog_id)

    return schemas.DialogChatMessageResponse(text=bot_response)


@dialog_sessions_router.get("/{dialog_session_id}/history", status_code=status.HTTP_200_OK)
async def get_dialog_session_history(
    dialog_session_id: int,
    user: schemas.User = Depends(verify_token),
    db: Session = Depends(get_db),
):
    """

    Returns:

    """
    dialog_session = crud.get_dialog_session(db, dialog_session_id)

    try:
        agent_dialog_id = dialog_session.agent_dialog_id
        if not agent_dialog_id:
            raise AttributeError
    except AttributeError:
        raise HTTPException(
            status_code=404,
            detail=f"No agent dialog id recorded for session {dialog_session.id}. Send a message first!",
        )
    else:
        history = await send_history_request_to_deployed_agent(
            dialog_session.deployment.chat_url, dialog_session.agent_dialog_id
        )

    return [schemas.DialogUtterance(**utterance) for utterance in history]
