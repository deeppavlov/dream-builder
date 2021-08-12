import os, json
from time import time
from typing import List, Dict, Any, Optional
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel
from nanoid import generate
from hashlib import sha1

class DBResLink(BaseModel):
    resid: str
    hash: str

class DBResource(BaseModel):
    resid: str
    type: str
    hash: str
    latest: bool
    timestamp: int
    linked: List[DBResLink]
    content: Dict[str, Any]

class NotFoundError(Exception):
    pass

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
    if res is None:
        raise NotFoundError()
    return DBResource(**res)

async def get_resources_with_type(db: AsyncIOMotorDatabase, type: str) -> List[DBResource]:
    res = db.resources.find({ 'type': type, 'latest': True })
    return [DBResource(**r) for r in await res.to_list(None)]

async def get_linked_resources(db: AsyncIOMotorDatabase, resid: str, type: Optional[str] = None) -> List[DBResource]:
    res = await get_resource(db, resid)
    linked_ids = [ c.resid for c in res.linked ]
    linked_hashes = [ c.hash for c in res.linked ]
    query = { 'resid': { '$in': linked_ids }, 'hash': { '$in': linked_hashes }, 'latest': True }
    if type is not None:
        query['type'] = type
    res = db.resources.find(query)
    return [DBResource(**r) for r in await res.to_list(None)]

async def get_resources_linking_to(db: AsyncIOMotorDatabase, targetresid: str, targethash: str, type: Optional[str] = None) -> List[DBResource]:
    query = { 'latest': True, 'linked': { 'resid': targetresid, 'hash': targethash } } 
    if type is not None:
        query['type'] = type
    res = db.resources.find(query)
    return [ DBResource(**r) for r in await res.to_list(None) ]

async def delete_resource(db: AsyncIOMotorDatabase, resid: str):
    old_res = await get_resource(db, resid)
    for linkedres in await get_resources_linking_to(db, resid, old_res.hash):
        await remove_linked(db, linkedres.resid, resid)
    await db.resources.update_many({ 'resid': resid }, { '$set': { 'latest': False } })

async def insert_resource(db: AsyncIOMotorDatabase, *, type: str, content:Any, linkedres: List[DBResLink] = []) -> DBResource:
    resid = generate()
    newres = DBResource(
        resid=resid,
        type=type,
        latest=True,
        hash="",
        timestamp=int(time()),
        content=content,
        linked=linkedres,
    )
    return await _update_resource(db, newres)

async def update_resource_content(db: AsyncIOMotorDatabase, resid: str, content: Any) -> DBResource:
    res = await get_resource(db, resid)
    res.content = content
    return await _update_resource(db, res)

async def add_linked(db: AsyncIOMotorDatabase, resid: str, linked: DBResource) -> DBResource:
    res = await get_resource(db, resid)
    res.linked.append(DBResLink(resid=linked.resid, hash=linked.hash))
    return await _update_resource(db, res)

async def update_linked(db: AsyncIOMotorDatabase, resid: str, linked: DBResource) -> DBResource:
    res = await get_resource(db, resid)
    new_link = DBResLink(resid=linked.resid, hash=linked.hash)
    res.linked = [ l if l.resid != linked.resid else new_link for l in res.linked ]
    return await _update_resource(db, res)

async def remove_linked(db: AsyncIOMotorDatabase, resid: str, linkedresid: str) -> DBResource:
    res = await get_resource(db, resid)
    res.linked = [ l for l in res.linked if l.resid != linkedresid ]
    return await _update_resource(db, res)

async def _update_resource(db: AsyncIOMotorDatabase, newrev: DBResource) -> DBResource:
    revhash = sha1()
    revhash.update(json.dumps(jsonable_encoder(newrev), sort_keys=True, ensure_ascii=True).encode())
    newrev.hash = revhash.hexdigest()
    await db.resources.update_many({ 'resid': newrev.resid }, { '$set': { 'latest': False } })
    await db.resources.insert_one(jsonable_encoder(newrev))

    return newrev
