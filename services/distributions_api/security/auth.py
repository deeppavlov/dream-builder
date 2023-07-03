from typing import Optional

import aiohttp
from fastapi import Depends, Header, HTTPException

from apiconfig.config import settings
from services.distributions_api import schemas


async def get_current_user(token: str = Header()) -> schemas.UserRead:
    header = {"token": token}

    async with aiohttp.ClientSession(headers=header) as session:
        async with session.get(f"{settings.url.auth_api}/auth/token") as response:
            json_data = await response.json()

            if response.status != 200:
                raise HTTPException(status_code=400, detail=json_data["detail"])

    return schemas.UserRead(**json_data)


async def get_current_user_or_none(token: Optional[str] = Header(default="")) -> Optional[schemas.UserRead]:
    header = {"token": token}
    user = None

    async with aiohttp.ClientSession(headers=header) as session:
        async with session.get(f"{settings.url.auth_api}/auth/token") as response:
            json_data = await response.json()

            if response.status == 200:
                user = schemas.UserRead(**json_data)

    return user
