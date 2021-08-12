import os, json
from time import time
from typing import List, Dict, Any, Optional
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel
from nanoid import generate
from hashlib import sha1

class DBResChild(BaseModel):
    resid: str
    hash: str

class DBResource(BaseModel):
    resid: str
    type: str
    hash: str
    latest: bool
    timestamp: int
    children: List[DBResChild]
    content: Dict[str, Any]

DB_URL = os.environ["MONGODB_URL"]
db_client: AsyncIOMotorClient = None

def get_db() -> AsyncIOMotorDatabase:
    global db_client
    return db_client['dp-builder']

async def init_db():
    global db_client
    db_client = AsyncIOMotorClient(DB_URL)

async def close_db():
    global db_client
    db_client.close()

async def get_resource(db: AsyncIOMotorDatabase, res_id: str) -> DBResource:
    res = await db.resources.find_one({ 'resid': res_id, 'latest': True })
    return DBResource(**res)

async def get_resources_with_type(db: AsyncIOMotorDatabase, type: str) -> List[DBResource]:
    res = db.resources.find({ 'type': type, 'latest': True })
    return [DBResource(**r) for r in await res.to_list(None)]

async def get_children_with_type(db: AsyncIOMotorDatabase, parentid: str, children_type: str) -> List[DBResource]:
    parent = await get_resource(db, parentid)
    children_ids = [ c.resid for c in parent.children ]
    res = db.resources.find({ 'type': children_type, 'resid': { '$in': children_ids }, 'latest': True })
    return [DBResource(**r) for r in await res.to_list(None)]

async def delete_resource(db: AsyncIOMotorDatabase, resid: str):
    await db.resources.update_many({ 'resid': resid }, { '$set': { 'latest': False } })

async def insert_resource(db: AsyncIOMotorDatabase, *, resid: Optional[str] = None, type: Optional[str] = None, content: Optional[Any] = None, children: Optional[List[DBResChild]] = None) -> DBResource:
    if resid is None:
        resid = generate()
        children = children or []
        if type is None:
            raise ValueError("Type is required for a new resource")
        if content is None:
            raise ValueError("Content is required for a new resource")
    else:
        if content is None and children is None:
            raise ValueError("Either content or children is required")
        old_res = await get_resource(db, resid)
        type = old_res.type
        children = children or old_res.children
        content = content or old_res.content  # type: ignore
        await db.resources.update_many({ 'resid': resid }, { '$set': { 'latest': False } })

    content_dict = jsonable_encoder(content)
    revhash = sha1()
    revhash.update(json.dumps(content_dict, sort_keys=True, ensure_ascii=True).encode())
    newrev = DBResource(
        resid=resid,
        type=type,
        latest=True,
        hash=revhash.hexdigest(),
        timestamp=int(time()),
        content=content_dict,
        children=children
    )
    await db.resources.insert_one(jsonable_encoder(newrev))
    return newrev

