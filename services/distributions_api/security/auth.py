import aiohttp
from fastapi import Header, HTTPException

from services.distributions_api.config import settings


async def verify_token(jwt_data: str = Header()):
    header = {"jwt-data": jwt_data}

    async with aiohttp.ClientSession(headers=header) as session:
        async with session.get(f"{settings.url.auth_api}/auth/token") as response:
            if response.status != 200:
                raise HTTPException(status_code=400, detail="bad token")
