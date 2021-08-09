from typing import List, Dict, Any, Optional
from motor.motor_asyncio import AsyncIOMotorDatabase
from fastapi import FastAPI, Depends

from .resdb.mongodb import DBResChild, init_db, close_db, get_db, get_resource, get_resources_with_type, get_children_with_type, insert_resource
from api_types_py import Component, Model

app = FastAPI()
app.add_event_handler("startup", init_db)
app.add_event_handler("shutdown", close_db)

@app.get("/components", response_model=List[Component])
async def list_comps(type: Optional[str] = None, db: AsyncIOMotorDatabase = Depends(get_db)):
    resources = await get_resources_with_type(db, type="component")
    return [ res.content for res in resources if type is None or res.content['type'] == type ]

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

# @app.delete("/components/{resid}")
# async def delete_comp(resid: str, db: AsyncIOMotorDatabase = Depends(get_db)):
#     pass

@app.get("/components/{resid}/models", response_model=List[Model])
async def list_models(resid: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    resources = await get_children_with_type(db, parentid=resid, children_type="model")
    return [ res.content for res in resources ]

@app.post("/components/{resid}/models")
async def post_model(resid: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    modelid = (await insert_resource(db, type="model", content=Model())).resid
    comp = await get_resource(db, resid)
    await insert_resource(db, resid=resid, children=[*comp.children, DBResChild(resid=modelid, hash="")])
    return modelid

@app.get("/components/{resid}/{data_type_plural}")
async def list_data(resid: str, data_type_plural: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    data_type = data_type_plural.rstrip("s")
    resources = await get_children_with_type(db, parentid=resid, children_type=data_type)
    return [ res.content for res in resources ]

@app.post("/components/{resid}/{data_type_plural}")
async def post_data(resid: str, data_type_plural: str, data: Dict[str, Any], db: AsyncIOMotorDatabase = Depends(get_db)):
    data_type = data_type_plural.rstrip("s")
    dataid = (await insert_resource(db, type=data_type, content=data)).resid
    comp = await get_resource(db, resid)
    await insert_resource(db, resid=resid, children=[*comp.children, DBResChild(resid=dataid, hash="")])
    return dataid

@app.put("/components/{resid}/{data_type_plural}/{dataid}")
async def put_data(dataid: str, newData: Dict[str, Any], db: AsyncIOMotorDatabase = Depends(get_db)):
    await insert_resource(db, resid=dataid, content=newData)


# @app.delete("/components/{resid}/{data_type}/{dataid}")
# async def delete_data(resid: str, data_type: str, dataid: str, db: AsyncIOMotorDatabase = Depends(get_db)):
#     return f"delete data with type {data_type} and id {dataid} in component id {resid}"

