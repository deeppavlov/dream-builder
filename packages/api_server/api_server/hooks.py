from .tasks import run_hook as run_task_hook
from .res import Resource
from api_types_py import Task

def run_hooks(res: Resource):
    if res.type == "task":
        task = Task(**res.dict())
        run_task_hook(task)
