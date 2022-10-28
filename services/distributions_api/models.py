from pydantic import BaseModel
from deeppavlov_dreamtools.distconfigs.manager import (
    DreamPipeline,
    DreamComposeOverride,
    DreamComposeDev,
    DreamComposeProxy,
    DreamComposeLocal,
)
from deeppavlov_dreamtools.distconfigs.generics import AnyConfig


class DreamDistModel(BaseModel):
    dist_path: str
    name: str
    dream_root: str
    pipeline_conf: DreamPipeline = None
    compose_override: DreamComposeOverride = None
    compose_dev: DreamComposeDev = None
    compose_proxy: DreamComposeProxy = None
    compose_local: DreamComposeLocal = None


class DreamDistConfigsImport(BaseModel):
    """
    {
    "name": "my_dream",
    "data": {
        "pipeline": {...},
        "compose_override": {...},
        "compose_dev": {...}
        }
    }
    """

    name: str
    data: dict[str, AnyConfig]
