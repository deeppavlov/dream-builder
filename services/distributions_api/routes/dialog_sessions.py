from typing import Optional

import aiohttp
from fastapi import APIRouter, Depends, HTTPException
from fastapi.logger import logger
from sqlalchemy.orm import Session
from starlette import status

from apiconfig.config import settings
from database import crud
from services.distributions_api import schemas
from services.distributions_api.database_maker import get_db
from services.distributions_api.security.auth import verify_token, verify_token_or_none

dialog_sessions_router = APIRouter(prefix="/api/dialog_sessions", tags=["dialog_sessions"])


async def send_chat_request_to_deployed_agent(
    agent_url: str, session_id: int, text: str, prompt: str = None, lm_service: str = None, openai_api_key: str = None
):
    """ """
    data = {
        "user_id": f"{settings.app.agent_user_id_prefix}_{session_id}",
        "payload": text,
    }
    if prompt:
        data["prompt"] = prompt
    if lm_service:
        data["lm_service_url"] = lm_service
    if openai_api_key:
        data["openai_api_key"] = openai_api_key

    # logger.warning(f"Sending {agent_url} data:\n{data}")

    async with aiohttp.ClientSession() as session:
        async with session.post(agent_url, json=data) as response:
            response_data = await response.json()

    # logger.warning(f"{agent_url} response:\n{response_data}")

    if response.status != 200:
        raise ValueError(f"Agent {agent_url} did not respond correctly. Response: {response}")

    try:
        dialog_id, response_text, active_skill = (
            response_data["dialog_id"],
            response_data["response"],
            response_data["active_skill"],
        )
    except KeyError:
        raise ValueError(f"No 'response', 'dialog_id' or 'active_skill' fields in agent response. Response: {response}")

    return dialog_id, response_text, active_skill


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


@dialog_sessions_router.post("", status_code=status.HTTP_201_CREATED)
async def create_dialog_session(
    payload: schemas.DialogSessionCreate,
    user: Optional[schemas.UserRead] = Depends(verify_token_or_none),
    db: Session = Depends(get_db),
):
    """ """
    if user:
        user_id = user.id
    else:
        user_id = None

    with db.begin():
        try:
            dialog_session = crud.create_dialog_session_by_name(db, user_id, payload.virtual_assistant_name)
        except ValueError as e:
            raise HTTPException(status_code=404, detail=str(e))

    return schemas.DialogSessionRead.from_orm(dialog_session)


@dialog_sessions_router.get("/{dialog_session_id}", status_code=status.HTTP_200_OK)
async def get_dialog_session(
    dialog_session_id: int,
    user: Optional[schemas.UserRead] = Depends(verify_token_or_none),
    db: Session = Depends(get_db),
):
    """ """
    try:
        dialog_session = crud.get_dialog_session(db, dialog_session_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

    return schemas.DialogSessionRead.from_orm(dialog_session)


@dialog_sessions_router.post("/{dialog_session_id}/chat", status_code=status.HTTP_201_CREATED)
async def send_dialog_session_message(
    dialog_session_id: int,
    payload: schemas.DialogChatMessageCreate,
    user: Optional[schemas.UserRead] = Depends(verify_token_or_none),
    db: Session = Depends(get_db),
):
    """
    text
    """
    with db.begin():
        try:
            dialog_session = crud.get_dialog_session(db, dialog_session_id)
        except ValueError as e:
            raise HTTPException(status_code=404, detail=str(e))

        virtual_assistant = crud.get_virtual_assistant(db, dialog_session.deployment.virtual_assistant_id)

        chat_url = f"{dialog_session.deployment.chat_host}:{dialog_session.deployment.chat_port}"

        if payload.lm_service_id:
            lm_service = crud.get_lm_service(db, payload.lm_service_id)
            lm_service_url = f"http://{lm_service.name}:{lm_service.default_port}/respond"
        else:
            lm_service_url = None

        agent_dialog_id, bot_response, active_skill = await send_chat_request_to_deployed_agent(
            chat_url,
            dialog_session.id,
            payload.text,
            payload.prompt,
            lm_service_url,
            payload.openai_api_key,
        )

        crud.update_dialog_session(db, dialog_session.id, agent_dialog_id)

    return schemas.DialogChatMessageRead(text=bot_response, active_skill=active_skill)


@dialog_sessions_router.get("/{dialog_session_id}/history", status_code=status.HTTP_200_OK)
async def get_dialog_session_history(
    dialog_session_id: int,
    user: Optional[schemas.UserRead] = Depends(verify_token_or_none),
    db: Session = Depends(get_db),
):
    """

    Returns:

    """
    try:
        dialog_session = crud.get_dialog_session(db, dialog_session_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

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
            f"{dialog_session.deployment.chat_host}:{dialog_session.deployment.chat_port}",
            dialog_session.agent_dialog_id,
        )

    return [schemas.DialogUtteranceRead(**utterance) for utterance in history]
