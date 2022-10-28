import asyncio
import logging
from pathlib import Path

from api_server import create_app
from api_server.routes.projects import create_project
from api_server.db import DB
from adapters import component
from manager.docker_runner import DockerRunner
from cotypes.common import Project

DB_URL = "sqlite:///./test.db"
logging.basicConfig(level=logging.INFO)

async def setup():
    db = DB(DB_URL)
    if len(await db.list_projects()) < 1:
        p = Path(__file__).parent.parent.parent.parent.parent / "components"
        await create_project(Project(name="default", export_root=str(p)), db)

asyncio.create_task(setup())

app = create_app(DB_URL, DockerRunner())
