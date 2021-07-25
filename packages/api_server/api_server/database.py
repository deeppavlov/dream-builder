import os
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

DB_URL = os.environ["MONGODB_URL"]
db_client: AsyncIOMotorClient = None

def get_db() -> AsyncIOMotorDatabase:
    global db_client
    return db_client['dp-builder']

async def connect_db():
    global db_client
    db_client = AsyncIOMotorClient(DB_URL)

async def close_db():
    global db_client
    db_client.close()
