from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.orm import Session
from starlette import status

from database.models import google_user, github_user
from database.models.providers.crud import get_provider_by_id
from database.models.user import crud
from services.distributions_api import schemas
from services.distributions_api.database_maker import get_db
from services.distributions_api.routes.users.schemas import PROVIDERS
from services.distributions_api.security.auth import get_current_user, get_admin_user

users_router = APIRouter(prefix="/api/users", tags=["users"])


@users_router.get("", status_code=status.HTTP_200_OK)
async def get_all_users(
    user: schemas.UserRead = Depends(get_admin_user),
    db: Session = Depends(get_db),
):
    users = crud.get_all(db)

    return [schemas.UserRead.from_orm(u) for u in users]


@users_router.get("/self", status_code=status.HTTP_200_OK)
async def get_user_self(user: schemas.UserRead = Depends(get_current_user)):
    return user


@users_router.get("/{user_id}", status_code=status.HTTP_200_OK)
async def get_user_by_id(
    user_id: int, user: schemas.UserRead = Depends(get_current_user), db: Session = Depends(get_db)
):
    selected_user = crud.get_by_id(db, user_id)

    return schemas.UserRead.from_orm(selected_user)


@users_router.put("/{user_id}", status_code=status.HTTP_200_OK)
async def update_user_by_id(
        user_id: int,
        updated_user: schemas.UserUpdate,
        current_user: schemas.UserRead = Depends(get_current_user),
        db: Session = Depends(get_db)
):
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail=f"The authorization token does not apply to this user!")
    if user_id != updated_user.id:
        if current_user.role.name != "admin":
            raise HTTPException(status_code=403, detail=f"No access!")

    provider_id = crud.get_by_id(db, updated_user.id).provider_id
    provider_name = get_provider_by_id(db, provider_id).service_name

    match provider_name:
        case PROVIDERS.GOOGLE:
            google_user.crud.update_by_id(db, user_id, **updated_user.dict())
        case PROVIDERS.GITHUB:
            github_user.crud.update_by_id(db, user_id, **updated_user.dict())
        case _:
            raise HTTPException(status_code=404, detail=f"No provider name {provider_name}!")

    selected_user = crud.get_by_id(db, user_id)

    return schemas.UserRead.from_orm(selected_user)


# @users_router.get("/{user_id}/settings/api_tokens/", status_code=status.HTTP_200_OK)
# async def get_user_api_tokens(
#     user_id: int,
#     user: schemas.UserRead = Depends(verify_token),
#     db: Session = Depends(get_db),
# ) -> [schemas.UserApiToken]:
#     user_api_tokens = crud.get_user_api_tokens(db, user_id)
#
#     return [schemas.UserApiToken.from_orm(t) for t in user_api_tokens]
#
#
# @users_router.post("/{user_id}/settings/api_tokens/", status_code=status.HTTP_201_CREATED)
# async def create_or_update_user_api_token(
#     user_id: int,
#     payload: schemas.CreateTokenRequest,
#     user: schemas.UserRead = Depends(verify_token),
#     db: Session = Depends(get_db),
# ) -> schemas.UserApiToken:
#     with db.begin():
#         user_api_token = crud.create_or_update_user_api_token(db, user_id, payload.api_token_id, payload.token_value)
#
#     return schemas.UserApiToken.from_orm(user_api_token)
#
#
# @users_router.get("/{user_id}/settings/api_tokens/{user_api_token_id}", status_code=status.HTTP_201_CREATED)
# async def get_user_api_token(
#     user_id: int,
#     user_api_token_id: int,
#     user: schemas.UserRead = Depends(verify_token),
#     db: Session = Depends(get_db),
# ) -> schemas.UserApiToken:
#     user_api_token = crud.get_user_api_token(db, user_api_token_id)
#
#     return schemas.UserApiToken.from_orm(user_api_token)
#
#
# @users_router.delete("/{user_id}/settings/api_tokens/{user_api_token_id}", status_code=status.HTTP_201_CREATED)
# async def delete_user_api_token(
#     user_id: int,
#     user_api_token_id: int,
#     user: schemas.UserRead = Depends(verify_token),
#     db: Session = Depends(get_db),
# ):
#     with db.begin():
#         crud.delete_user_api_token(db, user_api_token_id)
