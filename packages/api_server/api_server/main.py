from typing import Dict, Any, Optional
from motor.motor_asyncio import AsyncIOMotorDatabase
from fastapi import FastAPI, Depends, HTTPException
from devtools import debug

from .resdb.mongodb import DBResLink, init_db, close_db, get_db, get_resource, get_resources_with_type, get_linked_resources, insert_resource, delete_resource, get_resources_linking_to, add_linked, update_resource_content, update_linked
from api_types_py import Component, Training

app = FastAPI()
app.add_event_handler("startup", init_db)
app.add_event_handler("shutdown", close_db)

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
    debug(comp)
    resources = await get_resources_linking_to(db, resid, comp.hash, type="training")
    debug(resources)
    if len(resources) == 0:
        raise HTTPException(status_code=404)
    if len(resources) > 1:
        raise RuntimeError(f"Too many trainings linking to comp {resid}")
    return resources[0].content

@app.post("/components/{resid}/training")
async def post_training(resid: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    comp = await get_resource(db, resid)
    debug(comp)
    resources = await get_resources_linking_to(db, resid, comp.hash, type="training")
    debug(resources)
    if len(resources) > 0 :
        raise HTTPException(status_code=400, detail="There's already a training for this version of the component")
    training = await insert_resource(db, type="training", content=Training(status="running", data=[]), linkedres=[DBResLink(resid=resid, hash=comp.hash)])
    return training.resid

@app.get("/components/{resid}/{data_type_plural}")
async def list_data(resid: str, data_type_plural: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    data_type = data_type_plural.rstrip("s")
    resources = await get_linked_resources(db, resid, type=data_type)
    debug(resources)
    return { res.resid: res.content for res in resources }

@app.post("/components/{resid}/{data_type_plural}")
async def post_data(resid: str, data_type_plural: str, data: Dict[str, Any], db: AsyncIOMotorDatabase = Depends(get_db)):
    data_type = data_type_plural.rstrip("s")
    datares = await insert_resource(db, type=data_type, content=data)
    await add_linked(db, resid, datares)
    return datares.resid

@app.put("/components/{resid}/{data_type_plural}/{dataid}")
async def put_data(dataid: str, newData: Dict[str, Any], db: AsyncIOMotorDatabase = Depends(get_db)):
    datares = await get_resource(db, dataid)
    [comp, *_] = await get_resources_linking_to(db, dataid, datares.hash, type="component")
    updated_data = await update_resource_content(db, resid=dataid, content=newData)
    await update_linked(db, comp.resid, updated_data)

@app.delete("/components/{resid}/{data_type}/{dataid}")
async def delete_data(dataid: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    await delete_resource(db, dataid)

