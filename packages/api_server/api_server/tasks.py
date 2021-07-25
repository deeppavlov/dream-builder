import logging
import asyncio
import zmq
from zmq.asyncio import Context
from typing import Dict, Any

from api_types_py import Task

context = Context.instance() 
socket = context.socket(zmq.REQ)
socket.bind("tcp://*:5555")

async def new_task(task: Task):
    msg_to_send = {
        "type": "new",
        "task": task.content.dict()
    }
    await socket.send_json(msg_to_send)
    res = await socket.recv_json()
    print(f"Created task {task.content.task}. Got response {res}")

async def send_msg(msg: Dict[str, Any]):
    msg_to_send = {
        "type": "msg",
        "content": msg
    }
    await socket.send_json(msg_to_send)
    return await socket.recv_json()

def run_hook(task: Task):
    print("Running task hook")
    asyncio.create_task(new_task(task))

def close_zmq():
    socket.close()
