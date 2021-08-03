import logging
from typing import List, Optional
import aiohttp
from motor.motor_asyncio import AsyncIOMotorDatabase
from fastapi.encoders import jsonable_encoder

from api_types_py import Resource

WORKER_URL = "http://localhost:5555"

http_client: Optional[aiohttp.ClientSession] = None
def get_http_client() -> aiohttp.ClientSession:
    global http_client
    if http_client is None:
        http_client = aiohttp.ClientSession()
    return http_client

hooks_on_startup = get_http_client

async def hooks_on_shutdown():
    global http_client
    if http_client is not None:
        await http_client.close()

async def run_hooks(res: Resource):
    if res.type == "component":
        client = get_http_client()
        async with client.post(f"{WORKER_URL}/components", json=res.dict()) as response:
            if response.status != 201:
                raise RuntimeError("Worker returned error " + (await response.text()))
            logging.info("Component created")

async def get_res(db: AsyncIOMotorDatabase, res_id: str) -> Resource:
    res = await db.resources.find_one({ 'resid': res_id, 'latest': True })
    return res

async def get_all_with_type(db: AsyncIOMotorDatabase, type: str) -> List[Resource]:
    res = db.resources.find({ 'type': type, 'latest': True })
    return await res.to_list(None)

async def insert_res(db: AsyncIOMotorDatabase, res: Resource, disable_hooks: bool = False):
    if not disable_hooks:
        await run_hooks(res)
    await db.resources.update_many({ 'resid': res.resid }, { '$set': { 'latest': False } })
    newRev = {
        **jsonable_encoder(res),
        'latest': True
    }
    await db.resources.insert_one(newRev)

