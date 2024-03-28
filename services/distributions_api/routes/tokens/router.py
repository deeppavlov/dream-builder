from fastapi import APIRouter, Depends
from starlette import status

from services.distributions_api import schemas
from services.distributions_api.routes.tokens.dependencies import token_is_valid, check_if_error
from services.distributions_api.security.auth import get_current_user


tokens_router = APIRouter(prefix="/api/tokens", tags=["tokens"])

@tokens_router.post("/validate", status_code=status.HTTP_200_OK)
async def validate_token(
    payload: schemas.UserApiKey,
    user: schemas.UserRead = Depends(get_current_user)
) -> schemas.UserApiKeyResponse:

    return check_if_error(token_is_valid(payload))
