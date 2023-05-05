from typing import Callable

import aiohttp
from fastapi import Header, HTTPException, Depends
from starlette import status
from starlette.requests import Request

from apiconfig.config import settings
from database import crud, models
from services.distributions_api import schemas
from services.distributions_api.database_maker import get_db, SessionLocal


async def verify_token(token: str = Header(), db: SessionLocal = Depends(get_db)) -> schemas.UserRead:
    header = {"token": token}

    async with aiohttp.ClientSession(headers=header) as session:
        async with session.get(f"{settings.url.auth_api}/auth/token") as response:
            json_data = await response.json()

            if response.status != 200:
                raise HTTPException(status_code=400, detail=json_data["detail"])

    user = crud.get_user_by_sub(db, json_data["sub"])

    return schemas.UserRead.from_orm(user)


class ResourcePermission:
    def __init__(
        self,
        resource_getter: Callable[..., models.Base],
        resource_getter_field_name: str,
        user_resource_key: str,
        allow_for_owner: bool = False,
        required_permissions: list[str] = None,
    ):
        self.resource_getter = resource_getter
        self.resource_getter_field_name = resource_getter_field_name
        self.allow_for_owner = allow_for_owner
        self.user_resource_key = user_resource_key
        self.required_permissions = required_permissions

    async def __call__(
        self,
        request: Request,
        db: SessionLocal = Depends(get_db),
        user: schemas.UserRead = Depends(verify_token),
    ):
        try:
            value = self.resource_getter(db, request.path_params[self.resource_getter_field_name])
            owner: models.GoogleUser = getattr(value, self.user_resource_key)
            allow = False

            if self.allow_for_owner and owner.sub == user.sub:
                allow = True

            if self.required_permissions:
                if all(getattr(owner.role, p) for p in self.required_permissions):
                    allow = True

            if not allow:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN, detail=f"Your user does not have access to this resource"
                )

        except crud.ResourceNotFoundError as e:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=e)

        return value
