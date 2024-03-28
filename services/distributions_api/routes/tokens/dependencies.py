import json

from openai import OpenAI
from gigachat import GigaChat
from gigachat.models import Chat
from gigachat.exceptions import ResponseError
from fastapi import HTTPException
from fastapi.encoders import jsonable_encoder
from starlette import status
from starlette.responses import Response, JSONResponse

from services.distributions_api.schemas import UserApiKey, ErrorMessage, UserApiKeyResponse


def handle_exception(func):
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except ResponseError as e:
            status_code = e.args[1]
            error_message = json.loads(e.args[2].decode("utf-8"))
            return ErrorMessage(code=status_code, message=error_message["message"])
        except Exception as e:
            error = e.response.json()
            return ErrorMessage(code=e.response.status_code, message=error["error"]["message"])

    return wrapper


def check_if_error(obj):
    if type(obj) is ErrorMessage:
        return JSONResponse(status_code=obj.code, content=jsonable_encoder(obj))
    else:
        return UserApiKeyResponse(status_code=status.HTTP_200_OK, message="The token is valid!")


@handle_exception
def generate_openai_responses(api_key: str, model: str):
    client = OpenAI(api_key=api_key)

    message = [
        {
            "role": "user",
            "content": "Hi"
        }
    ]

    return client.chat.completions.create(model=model, messages=message, max_tokens=5)


@handle_exception
def generate_gigachat_responses(api_key: str, model: str):
    giga = GigaChat(credentials=api_key, verify_ssl_certs=False)

    messages = [
        {
            "role": "user",
            "content": "Привет!",
        }
    ]

    return giga.chat(Chat(messages=messages, model=model, max_tokens=5))


RESPONSE_GENERATION_CONFIGS = {
    "openai_api_key": generate_openai_responses,
    "gigachat_credential": generate_gigachat_responses,
}


def token_is_valid(user_api_key: UserApiKey):

    if not user_api_key.lm_service.api_key.name:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No API key name")

    api_key_name = user_api_key.lm_service.api_key.name

    if not RESPONSE_GENERATION_CONFIGS.get(api_key_name):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No API key name in configs")

    return RESPONSE_GENERATION_CONFIGS[api_key_name](user_api_key.api_key_value, user_api_key.lm_service.model_name)