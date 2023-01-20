import aiohttp
from fastapi import Header, HTTPException

from services.distributions_api.config import settings


async def verify_token(token: str = Header()):
    header = {"token": token}

    async with aiohttp.ClientSession(headers=header) as session:
        async with session.get(f"{settings.url.auth_api}/auth/token") as response:
            if response.status != 200:
                json_data = await response.json()
                raise HTTPException(status_code=400, detail=json_data["detail"])
