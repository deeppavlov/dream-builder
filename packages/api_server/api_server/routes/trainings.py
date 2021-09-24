from typing import List
from fastapi import APIRouter, Depends, HTTPException
from fastapi.encoders import jsonable_encoder

from api_server.db import DB
from cotypes.data_schemas import schemas as data_schemas
from cotypes.manager import ComponentRunner
from cotypes.common import Training, Message, Component

router = APIRouter(prefix='/trainings')

@router.get("/{train_id}", response_model=Training)
async def get_training(train_id: int, db: DB = Depends()):
    return jsonable_encoder(await db.get_training(train_id))

# @router.get("/{train_id}/messages", response_model=List[Message])
# async def get_messages(train_id: int, db: DB = Depends()):
#     return await db.list_messages(train_id)

@router.post("/{train_id}/messages", response_model=Message)
async def create_message(train_id: int, msg: Message, db: DB = Depends(), runner: ComponentRunner = Depends()):
    training = await db.get_training(train_id)
    comp = Component(**(await db.get_component(training['component_id'])))

    message_hist: List[Message] = []
    for prev_msg in await db.list_messages(train_id):
        message_hist.append(Message(**prev_msg['request']))
        message_hist.append(Message(**prev_msg['response']))
    message_hist.append(msg)

    response = await runner.interact(training['data_hash'], comp, message_hist)
    await db.create_message(train_id, msg.dict(), response.dict())
    return response

@router.get("/{train_id}/data")
async def get_training_data(train_id: int, db: DB = Depends()):
    return await db.list_all_training_data(train_id)

@router.get("/{train_id}/{data_type_plural}")
async def get_training_data_by_type(train_id: int, data_type_plural: str, db: DB = Depends()):
    data_type = data_type_plural[:-1]
    if data_type not in data_schemas:
        raise HTTPException(404, detail=f"Invalid data type {data_type}")
    return await db.list_training_data(train_id, data_type)
