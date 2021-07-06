from typing import Optional, List
from motor.motor_asyncio import AsyncIOMotorDatabase
from fastapi import FastAPI, Depends
from nanoid import generate

from .database import connect_db, close_db, get_db
from .res import get_res, get_all_with_type, insert_res
from api_types.IntentResource import Intent

app = FastAPI()

app.add_event_handler("startup", connect_db)
app.add_event_handler("shutdown", close_db)

@app.get("/api/res/{resid}", response_model=Intent)
async def getres(resid: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    return await get_res(db, resid)

@app.put("/api/res/{resid}", response_model=Intent)
async def putres(resid: str, res: Intent, db: AsyncIOMotorDatabase = Depends(get_db)):
    res.resid = resid
    await insert_res(db, res)
    return await get_res(db, resid)

@app.post("/api/res", response_model=Intent)
async def postres(res: Intent, db: AsyncIOMotorDatabase = Depends(get_db)):
    resid = generate()
    res.resid = resid
    await insert_res(db, res)
    return await get_res(db, resid)

@app.get("/api/res", response_model=List[Intent])
async def findres(type: Optional[str] = None, db: AsyncIOMotorDatabase = Depends(get_db)):
    if type is not None:
        return await get_all_with_type(db, type)
    else:
        return []

@app.post("/api/res/{resid}/train")
async def train(resid: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    return 1
