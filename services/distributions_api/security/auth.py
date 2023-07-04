from typing import Optional

import aiohttp
from fastapi import Header, HTTPException

from apiconfig.config import settings
from services.distributions_api import schemas


async def verify_token(token: str = Header(), auth_type: str = Header(default="")) -> schemas.User:
    header = {
        "token": token,
        "auth-type": auth_type
    }
    auth_url = f"{settings.url.auth_api}/auth/token"
    async with aiohttp.ClientSession(headers=header) as session:
        async with session.get(auth_url) as response:
            json_data = await response.json()
            if response.status != 200:
                raise HTTPException(status_code=400, detail=json_data["detail"])

    return schemas.User(**json_data)


async def verify_token_or_none(token: Optional[str] = Header(default=""), auth_type: Optional[str] = Header(default="")) -> Optional[schemas.User]:
    if token:
        return await verify_token(token, auth_type)
    else:
        return None
