import jsonschema
from typing import Dict, Any
from fastapi import APIRouter, Depends, HTTPException

from api_server.db import DB
from cotypes.data_schemas import schemas as data_schemas

router = APIRouter(prefix='/data')

@router.get("/{data_id}")
async def get_data(data_id: int, db: DB = Depends()):
    return (await db.get_data(data_id))['content']

@router.put("/{data_id}")
async def put_data(data_id: int, new_data: Dict[str, Any], db: DB = Depends()):
    data_type = (await db.get_data(data_id))['type']
    try:
        jsonschema.validate(instance=new_data, schema=data_schemas[data_type])
    except jsonschema.ValidationError as err:
        raise HTTPException(400, detail=err.message)
    await db.update_data(data_id, new_data)
    return new_data

@router.delete("/{data_id}")
async def delete_data(data_id: int, db: DB = Depends()):
    await db.delete_data(data_id)
    return data_id
