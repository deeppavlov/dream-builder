from typing import List

from fastapi import APIRouter, Depends
from starlette import status

from services.distributions_api import schemas
from services.distributions_api.routes.api_keys.dependencies import get_all_api_keys

api_keys_router = APIRouter(prefix="/api/api_keys", tags=["api_keys"])


@api_keys_router.get("", status_code=status.HTTP_200_OK)
async def get_all_api_keys(api_keys: List[schemas.ApiKeyRead] = Depends(get_all_api_keys)):
    return api_keys
