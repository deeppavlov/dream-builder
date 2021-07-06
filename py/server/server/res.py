from typing import List
from motor.motor_asyncio import AsyncIOMotorDatabase
from fastapi.encoders import jsonable_encoder

from api_types.IntentResource import Intent

async def get_res(db: AsyncIOMotorDatabase, res_id: str) -> Intent:
    res = await db.resources.find_one({ 'resid': res_id, 'latest': True })
    return res

async def get_all_with_type(db: AsyncIOMotorDatabase, type: str) -> List[Intent]:
    res = db.resources.find({ 'type': type, 'latest': True })
    return await res.to_list(None)

async def insert_res(db: AsyncIOMotorDatabase, res: Intent):
    await db.resources.update_many({ 'resid': res.resid }, { '$set': { 'latest': False } })
    newRev = {
        **jsonable_encoder(res),
        'latest': True
    }
    await db.resources.insert_one(newRev)

