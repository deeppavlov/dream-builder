import aiohttp
from fastapi import Header, HTTPException

from apiconfig.config import settings
from services.distributions_api import schemas


async def verify_token(token: str = Header()) -> schemas.User:
    header = {"token": token}

    async with aiohttp.ClientSession(headers=header) as session:
        async with session.get(f"{settings.url.auth_api}/auth/token") as response:
            json_data = await response.json()

            if response.status != 200:
                raise HTTPException(status_code=400, detail=json_data["detail"])

    return schemas.User(**json_data)
