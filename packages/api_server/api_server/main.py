from typing import Optional, List
from motor.motor_asyncio import AsyncIOMotorDatabase
from fastapi import FastAPI, Depends
from nanoid import generate

from .database import connect_db, close_db, get_db
from .res import Resource, get_res, get_all_with_type, insert_res, hooks_on_startup, hooks_on_shutdown

app = FastAPI()

app.add_event_handler("startup", connect_db)
app.add_event_handler("startup", hooks_on_startup)
app.add_event_handler("shutdown", close_db)
app.add_event_handler("shutdown", hooks_on_shutdown)

@app.get("/api/res/{resid}", response_model=Resource)
async def getres(resid: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    return await get_res(db, resid)

@app.put("/api/res/{resid}", response_model=Resource)
async def putres(resid: str, res: Resource, disable_hooks: int = 0, db: AsyncIOMotorDatabase = Depends(get_db)):
    res.resid = resid
    print("disable hooks", disable_hooks)
    await insert_res(db, res, disable_hooks=disable_hooks == 1)
    return await get_res(db, resid)

@app.post("/api/res", response_model=Resource)
async def postres(res: Resource, disable_hooks: int = 0, db: AsyncIOMotorDatabase = Depends(get_db)):
    resid = generate()
    res.resid = resid
    await insert_res(db, res, disable_hooks=disable_hooks == 1)
    return await get_res(db, resid)

@app.get("/api/res", response_model=List[Resource])
async def findres(type: Optional[str] = None, db: AsyncIOMotorDatabase = Depends(get_db)):
    if type is not None:
        return await get_all_with_type(db, type)
    else:
        return []

