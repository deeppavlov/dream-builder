from .tasks import run_hook as run_task_hook
from .res import Resource
from api_types_py import Component

def run_hooks(res: Resource):
    if res.type == "component":
        task = Component(**res.dict())
        run_task_hook(task)
