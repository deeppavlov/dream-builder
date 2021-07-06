from motor.motor_asyncio import AsyncIOMotorDatabase
from fastapi.encoders import jsonable_encoder

from api_types import Resource

async def get_resource(db: AsyncIOMotorDatabase, res_id: str) -> Resource:
    res = await db.resources.find_one({ 'resid': res_id })
    return res

async def createResource(db: AsyncIOMotorDatabase, res: Resource):
    data = jsonable_encoder(res)
    await db.resources.insert_one(data)
