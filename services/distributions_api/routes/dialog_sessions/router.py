from typing import Optional

import aiohttp
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from starlette import status

from apiconfig.config import settings
from database.models.dialog_session import crud
from database.models.lm_service import crud as lm_service_crud
from database.models.virtual_assistant import crud as virtual_assistant_crud
from database.models.virtual_assistant_component import crud as virtual_assistant_component_crud
from services.distributions_api import schemas
from services.distributions_api.database_maker import get_db
from services.distributions_api.routes.dialog_sessions.dependencies import (
    dialog_session_permission,
    dialog_session_create_permission,
)
from services.distributions_api.security.auth import get_current_user_or_none

dialog_sessions_router = APIRouter(prefix="/api/dialog_sessions", tags=["dialog_sessions"])


async def send_chat_request_to_deployed_agent(
        agent_url: str,
        session_id: int,
        text: str,
        prompt: str = None,
        lm_service: str = None,
        openai_api_key: str = None,
        max_tokens: int = None
):
    """ """
    data = {
        "user_id": f"agent-{settings.app.agent_user_id_prefix}_{session_id}",
        "payload": text,
    }
    if prompt:
        data["prompt"] = prompt
    if lm_service:
        data["lm_service_url"] = lm_service
    if max_tokens:
        data["max_tokens"] = max_tokens
    if openai_api_key:
        data["openai_api_key"] = openai_api_key
    elif isinstance(openai_api_key, str):
        data["openai_api_key"] = " "
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
            active_skill = utterance.get("active_skill")

            history.append({"author": author, "text": text, "active_skill": active_skill})

    return history


@dialog_sessions_router.post("", status_code=status.HTTP_201_CREATED)
async def create_dialog_session(
    user: Optional[schemas.UserRead] = Depends(get_current_user_or_none),
    virtual_assistant: schemas.VirtualAssistantRead = Depends(dialog_session_create_permission),
    db: Session = Depends(get_db),
):
    """ """
    if user:
        user_id = user.id
    else:
        user_id = None

    try:
        dialog_session = crud.create_dialog_session_by_name(db, user_id, virtual_assistant.name)
        db.commit()
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

    return schemas.DialogSessionRead.from_orm(dialog_session)


@dialog_sessions_router.get("/{dialog_session_id}", status_code=status.HTTP_200_OK)
async def get_dialog_session(dialog_session: schemas.DialogSessionRead = Depends(dialog_session_permission)):
    """ """
    return dialog_session


@dialog_sessions_router.post("/{dialog_session_id}/chat", status_code=status.HTTP_201_CREATED)
async def send_dialog_session_message(
    payload: schemas.DialogChatMessageCreate,
    dialog_session: schemas.DialogSessionRead = Depends(dialog_session_permission),
    db: Session = Depends(get_db),
):
    """
    text
    """
    chat_url = f"{dialog_session.deployment.chat_host}:{dialog_session.deployment.chat_port}"

    if payload.lm_service_id:
        lm_service = lm_service_crud.get_lm_service(db, payload.lm_service_id)
        lm_service_url = f"http://{lm_service.name}:{lm_service.port}/respond"
    else:
        lm_service_url = None

    max_tokens = getattr(payload, 'max_tokens', None)

    agent_dialog_id, bot_response, active_skill = await send_chat_request_to_deployed_agent(
        chat_url,
        dialog_session.id,
        payload.text,
        payload.prompt,
        lm_service_url,
        payload.openai_api_key,
        max_tokens
    )

    crud.update_dialog_session(db, dialog_session.id, agent_dialog_id)

    virtual_assistant = virtual_assistant_crud.get_by_id(db, dialog_session.deployment.virtual_assistant.id)
    active_va_component = virtual_assistant_component_crud.get_by_component_name(db, virtual_assistant.id, active_skill)
    db.commit()

    return schemas.DialogChatMessageRead(
        text=bot_response, active_skill=schemas.ComponentRead.from_orm(active_va_component.component)
    )


@dialog_sessions_router.get("/{dialog_session_id}/history", status_code=status.HTTP_200_OK)
async def get_dialog_session_history(
    dialog_session: schemas.DialogSessionRead = Depends(dialog_session_permission), db: Session = Depends(get_db)
):
    """

    Returns:

    """
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
        raw_history = await send_history_request_to_deployed_agent(
            f"{dialog_session.deployment.chat_host}:{dialog_session.deployment.chat_port}",
            dialog_session.agent_dialog_id,
        )

        history = []
        virtual_assistant = virtual_assistant_crud.get_by_id(db, dialog_session.deployment.virtual_assistant.id)
        for message in raw_history:
            if message.get("active_skill"):
                active_va_component = virtual_assistant_component_crud.get_by_component_name(
                    db, virtual_assistant.id, message["active_skill"]
                )
                active_skill = schemas.ComponentRead.from_orm(active_va_component.component)
            else:
                active_skill = None
            utterance = schemas.DialogUtteranceRead(
                author=message["author"],
                text=message["text"],
                active_skill=active_skill,
            )
            history.append(utterance)

    return history
