from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from starlette import status

from database import crud
from services.distributions_api import schemas
from services.distributions_api.database_maker import get_db
from services.distributions_api.security.auth import verify_token

users_router = APIRouter(prefix="/api/users", tags=["users"])


@users_router.get("/", status_code=status.HTTP_200_OK)
async def get_all_users(
    user: schemas.User = Depends(verify_token),
    db: Session = Depends(get_db),
):
    users = crud.get_all_users(db)

    return [schemas.User.from_orm(u) for u in users]


@users_router.get("/self", status_code=status.HTTP_200_OK)
async def get_user_self(user: schemas.User = Depends(verify_token)):
    return user


@users_router.get("/{user_id}", status_code=status.HTTP_200_OK)
async def get_user_by_id(user_id: int, user: schemas.User = Depends(verify_token), db: Session = Depends(get_db)):
    selected_user = crud.get_user(db, user_id)

    return schemas.User.from_orm(selected_user)


@users_router.get("/{user_id}/settings/api_tokens/", status_code=status.HTTP_200_OK)
async def create_or_update_user_api_token(
    user_id: int,
    user: schemas.User = Depends(verify_token),
    db: Session = Depends(get_db),
) -> [schemas.UserApiToken]:
    user_api_tokens = crud.get_user_api_tokens(db, user_id)

    return [schemas.UserApiToken.from_orm(t) for t in user_api_tokens]


@users_router.post("/{user_id}/settings/api_tokens/", status_code=status.HTTP_201_CREATED)
async def create_or_update_user_api_token(
    user_id: int,
    payload: schemas.CreateTokenRequest,
    user: schemas.User = Depends(verify_token),
    db: Session = Depends(get_db),
) -> schemas.UserApiToken:
    user_api_token = crud.create_or_update_user_api_token(db, user_id, payload.api_token_id, payload.token_value)

    return schemas.UserApiToken.from_orm(user_api_token)
