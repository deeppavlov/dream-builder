from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from starlette import status

from services.distributions_api import schemas
from services.distributions_api.routes.api_keys.dependencies import get_all_api_keys
from services.distributions_api.security.auth import get_current_user

tokens_router = APIRouter(prefix="/api/api_keys", tags=["api_keys"])


@tokens_router.get("", status_code=status.HTTP_200_OK)
async def get_all_api_keys(api_keys: List[schemas.ApiKeyRead] = Depends(get_all_api_keys)):
    return api_keys
