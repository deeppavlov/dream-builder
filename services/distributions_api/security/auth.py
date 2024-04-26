from typing import Optional

import aiohttp
from fastapi import Depends, Header, HTTPException
from starlette import status

from apiconfig.config import settings
from services.distributions_api import schemas


async def get_current_user(token: str = Header(), auth_type: str = Header(default="")) -> schemas.User:
    header = {"token": token, "auth-type": auth_type}
    auth_url = f"{settings.url.auth_api}/auth/token"
    async with aiohttp.ClientSession(headers=header) as session:
        async with session.get(auth_url) as response:
            json_data = await response.json()

            if response.status != 200:
                raise HTTPException(status_code=400, detail=json_data["detail"])
    return schemas.UserRead(**json_data)


async def get_current_user_or_none(
    token: Optional[str] = Header(default=""), auth_type: str = Header(default="")
) -> Optional[schemas.UserRead]:
    header = {"token": token, "auth-type": auth_type}
    user = None

    auth_url = f"{settings.url.auth_api}/auth/token"

    async with aiohttp.ClientSession(headers=header) as session:
        async with session.get(auth_url) as response:
            json_data = await response.json()

            if response.status == 200:
                user = schemas.UserRead(**json_data)

    return user


async def get_admin_user(user: schemas.UserRead = Depends(get_current_user)) -> Optional[schemas.UserRead]:
    if not user.role.name in ("admin", "moderator"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Requires admin user")

    return user
