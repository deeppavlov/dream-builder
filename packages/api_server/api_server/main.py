from typing import Optional, List
from motor.motor_asyncio import AsyncIOMotorDatabase
from fastapi import FastAPI, Depends
from nanoid import generate

from .database import connect_db, close_db, get_db
from .res import Resource, get_res, get_all_with_type, insert_res
from .tasks import close_zmq

app = FastAPI()

app.add_event_handler("startup", connect_db)
app.add_event_handler("shutdown", close_db)
app.add_event_handler("shutdown", close_zmq)

@app.get("/api/res/{resid}", response_model=Resource)
async def getres(resid: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    return await get_res(db, resid)

@app.put("/api/res/{resid}", response_model=Resource)
async def putres(resid: str, res: Resource, db: AsyncIOMotorDatabase = Depends(get_db)):
    res.resid = resid
    await insert_res(db, res)
    return await get_res(db, resid)

@app.post("/api/res", response_model=Resource)
async def postres(res: Resource, db: AsyncIOMotorDatabase = Depends(get_db)):
    resid = generate()
    res.resid = resid
    await insert_res(db, res)
    return await get_res(db, resid)

@app.get("/api/res", response_model=List[Resource])
async def findres(type: Optional[str] = None, db: AsyncIOMotorDatabase = Depends(get_db)):
    if type is not None:
        return await get_all_with_type(db, type)
    else:
        return []

