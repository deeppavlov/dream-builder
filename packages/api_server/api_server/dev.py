import asyncio, json
import logging
from api_server import create_app
from manager.docker_runner import DockerRunner
from cotypes.manager import ComponentRunner
from cotypes.common.training import Status

logging.basicConfig(level=logging.INFO)
# logging.getLogger('manager').setLevel(logging.INFO)

class FakeRunner(ComponentRunner):
    async def start_training(self, training_hash: str, comp, data):
        print('training', training_hash, comp)
        print(json.dumps(data, indent=4))
        await asyncio.sleep(1)
        return Status.SUCCESS
    
    async def interact(self, training_hash: str, msg):
        print('message', training_hash, msg)
        await asyncio.sleep(1)
        return {}

app = create_app("sqlite:///./test.db", DockerRunner())
