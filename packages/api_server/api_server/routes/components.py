import asyncio
import logging
import jsonschema
from pathlib import Path
from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from fastapi.encoders import jsonable_encoder

from api_server.db import DB, NotFoundError
from adapters.concurrent import export_component
from adapters import store
from cotypes.data_schemas import schemas as data_schemas
from cotypes.manager import ComponentRunner
from cotypes.common import Component, Training, Data
from cotypes.common.training import Status

router = APIRouter(prefix='/components')

async def _run_train_and_save_status(cor, train_id: int, db: DB):
    try:
        status: Status = await cor
    except (KeyboardInterrupt, SystemExit):
        raise
    except Exception as e:
        logging.error(f"Training crashed:\n{e}")
        status = Status.FAILED
    await db.update_training_status(train_id, status)

@router.get("/{comp_id}", response_model=Component)
async def get_component(comp_id: int, db: DB = Depends()):
    return await db.get_component(comp_id)

@router.get("/{comp_id}/data", response_model=Dict[str, List[Data]])
async def list_data(comp_id: int, db: DB = Depends()):
    return await db.list_all_component_data(comp_id)

@router.post("/{comp_id}/exports")
async def post_export_component(comp_id: int, db: DB = Depends()):
    comp = await db.get_component(comp_id)
    data_with_ids = await db.list_all_component_data(comp_id)
    data = { type: [ item['content'] for item in items ] for type, items in data_with_ids.items() }
    proj = await db.get_project_by_id(comp['project_id'])
    comp_path = Path(proj['export_root']) / comp['group'] / comp['label']
    await export_component(Component(**comp), data, comp_path)

@router.get("/{comp_id}/trainings", response_model=List[Training])
async def list_trainings(comp_id: int, db: DB = Depends()):
    return jsonable_encoder(await db.list_trainings(comp_id))

@router.post("/{comp_id}/trainings", response_model=Training)
async def create_training(comp_id: int, db: DB = Depends(), runner: ComponentRunner = Depends()):
    comp = await db.get_component(comp_id)
    try:
        last_training = await db.get_training_by_hash(comp_id, comp['data_hash'])
        if last_training is not None and last_training['status'] != Status.FAILED:
            raise HTTPException(status_code=400, detail="This component has already been trained with this data")
    except NotFoundError:
        pass

    async with db.db.transaction():
        template_link = store.store(Path(comp['template_link']), driver_name="git")
        new_train_id = await db.create_training(comp_id, template_link)
        new_training = await db.get_training(new_train_id)
        data_with_ids = await db.list_all_component_data(comp_id)
        data = { type: [ item['content'] for item in items ] for type, items in data_with_ids.items() }

        training_cor = runner.start_training(new_training['data_hash'], template_link, Component(**comp), data)
        asyncio.create_task(_run_train_and_save_status(training_cor, new_train_id, db))
        return jsonable_encoder(new_training)

@router.get("/{comp_id}/last_training", response_model=Training)
async def get_last_training(comp_id: int, db: DB = Depends()):
    comp = await db.get_component(comp_id)
    training = await db.get_training_by_hash(comp_id, comp['data_hash'])
    return jsonable_encoder(training)

@router.get("/{comp_id}/{data_type_plural}", response_model=List[Data])
async def list_data_by_type(comp_id: int, data_type_plural: str, db: DB = Depends()):
    data_type = data_type_plural[:-1]
    if data_type not in data_schemas:
        raise HTTPException(404, detail=f"Invalid data type {data_type}")
    data_items = await db.list_data(comp_id, data_type)
    return [ item for item in data_items ]

@router.post("/{comp_id}/{data_type_plural}")
async def create_data(comp_id: int, data_type_plural: str, data_cont: Dict[str, Any], db: DB = Depends()):
    data_type = data_type_plural[:-1]
    if data_type not in data_schemas:
        raise HTTPException(404, detail=f"Invalid data type {data_type}")
    try:
        jsonschema.validate(instance=data_cont, schema=data_schemas[data_type])
    except jsonschema.ValidationError as err:
        raise HTTPException(400, detail=err.message)

    new_data_id = await db.create_data(comp_id, data_type, data_cont)
    new_data = await db.get_data(new_data_id)
    return new_data
