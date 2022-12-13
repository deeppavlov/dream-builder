import aiohttp
from const import AUTH_URL
from fastapi import Header, HTTPException


async def verify_token(jwt_data: str = Header()):
    header = {"jwt-data": jwt_data}
    async with aiohttp.ClientSession(headers=header) as session:
        async with session.get(AUTH_URL) as response:
            if response.status != 200:
                raise HTTPException(status_code=400, detail="bad token")
