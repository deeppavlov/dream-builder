import aiohttp
from typing import Dict, Any, Optional, List
from motor.motor_asyncio import AsyncIOMotorDatabase
from fastapi import FastAPI, Depends, HTTPException
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel

from .resdb.mongodb import DBResLink, init_db, close_db, get_db, get_resource, get_resources_with_type, get_linked_resources, insert_resource, delete_resource, get_resources_linking_to, add_linked, update_resource_content, update_linked
from api_types_py import Component, Training

class NewStatus(BaseModel):
    status: str

class InteractMsg(BaseModel):
    msg: List[str]

WORKER_URL = "http://localhost:5555"

http_client: Optional[aiohttp.ClientSession] = None
async def get_http_client() -> aiohttp.ClientSession:
    global http_client
    if http_client is None:
        http_client = aiohttp.ClientSession()
    return http_client

async def on_shutdown():
    global http_client
    if http_client is not None:
        await http_client.close()
        http_client = None

app = FastAPI()
app.add_event_handler("startup", init_db)
app.add_event_handler("shutdown", close_db)
app.add_event_handler("shutdown", on_shutdown)

@app.get("/components", response_model=Dict[str, Component])
async def list_comps(type: Optional[str] = None, db: AsyncIOMotorDatabase = Depends(get_db)):
    resources = await get_resources_with_type(db, type="component")
    return { res.resid: res.content for res in resources if type is None or res.content['type'] == type }

@app.post("/components")
async def post_comp(comp: Component, db: AsyncIOMotorDatabase = Depends(get_db)):
    newres = await insert_resource(db, type="component", content=comp)
    return newres.resid

@app.get("/components/{resid}", response_model=Component)
async def get_comp(resid: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    res = await get_resource(db, resid)
    return res.content

# @app.patch("/components/{resid}")
# async def patch_comp(resid: str, db: AsyncIOMotorDatabase = Depends(get_db)):
#     pass

@app.delete("/components/{resid}")
async def delete_comp(resid: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    await delete_resource(db, resid)

@app.get("/components/{resid}/training", response_model=Training)
async def get_training(resid: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    comp = await get_resource(db, resid)
    resources = await get_resources_linking_to(db, resid, comp.hash, type="training")
    if len(resources) == 0:
        raise HTTPException(status_code=404)
    if len(resources) > 1:
        raise RuntimeError(f"Too many trainings linking to comp {resid}")
    return resources[0].content

@app.post("/components/{resid}/training")
async def post_training(resid: str, db: AsyncIOMotorDatabase = Depends(get_db), client: aiohttp.ClientSession = Depends(get_http_client)):
    comp = await get_resource(db, resid)
    resources = await get_resources_linking_to(db, resid, comp.hash, type="training")
    if len(resources) > 0 :
        raise HTTPException(status_code=400, detail="There's already a training for this version of the component")
    training = await insert_resource(db, type="training", content=Training(status="running"), linkedres=[DBResLink(resid=resid, hash=comp.hash)])

    resources = await get_linked_resources(db, resid)
    data = {}
    for res in resources:
        if res.type not in data:
            data[res.type] = []
        data[res.type].append(jsonable_encoder(res.content))
    training_req = {
        'training_id': training.resid,
        'component_id': comp.resid,
        'component': jsonable_encoder(comp.content),
        'data': data
    }
    async with client.post(f"{WORKER_URL}/trainings", json=training_req) as req:
        if req.status != 200:
            raise HTTPException(status_code=500, detail="Posting training unsuccesful")
    return training.resid

@app.put("/components/{resid}/training/{trainid}")
async def put_training(trainid: str, new_status: NewStatus, db: AsyncIOMotorDatabase = Depends(get_db)):
    training = await get_resource(db, trainid)
    training.content['status'] = new_status.status # type: ignore
    await update_resource_content(db, trainid, training.content)
    return training.resid

@app.post("/components/{resid}/interact")
async def post_interact(resid: str, body: InteractMsg, db: AsyncIOMotorDatabase = Depends(get_db), client: aiohttp.ClientSession = Depends(get_http_client)):
    comp = await get_resource(db, resid)
    trainings = await get_resources_linking_to(db, resid, comp.hash, type="training")
    if len(trainings) == 0:
        raise HTTPException(status_code=400, detail="No training for this version")
    trainid = trainings[0].resid
    async with client.post(f"{WORKER_URL}/interact/{comp.content['type']}/{trainid}", json=jsonable_encoder(body)) as req:
        if req.status != 200:
            raise HTTPException(status_code=500, detail="Posting message unsuccesful")
        return await req.json()

@app.get("/components/{resid}/{data_type_plural}")
async def list_data(resid: str, data_type_plural: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    data_type = data_type_plural.rstrip("s")
    resources = await get_linked_resources(db, resid, type=data_type)
    return { res.resid: res.content for res in resources }

@app.post("/components/{resid}/{data_type_plural}")
async def post_data(resid: str, data_type_plural: str, data: Dict[str, Any], db: AsyncIOMotorDatabase = Depends(get_db)):
    data_type = data_type_plural.rstrip("s")
    datares = await insert_resource(db, type=data_type, content=data)
    await add_linked(db, resid, datares)
    return datares.resid

@app.put("/components/{resid}/{data_type_plural}/{dataid}")
@app.put("/data/{data_type_plural}/{dataid}")
async def put_data(dataid: str, newData: Dict[str, Any], db: AsyncIOMotorDatabase = Depends(get_db)):
    datares = await get_resource(db, dataid)
    [comp, *_] = await get_resources_linking_to(db, dataid, datares.hash, type="component")
    updated_data = await update_resource_content(db, resid=dataid, content=newData)
    await update_linked(db, comp.resid, updated_data)

@app.delete("/components/{resid}/{data_type_plural}/{dataid}")
@app.delete("/data/{data_type_plural}/{dataid}")
async def delete_data(dataid: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    await delete_resource(db, dataid)


