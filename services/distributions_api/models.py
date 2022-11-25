from pydantic import BaseModel

from deeppavlov_dreamtools.distconfigs.generics import AnyConfig
from deeppavlov_dreamtools.distconfigs.generics import (
    PipelineConf,
    ComposeOverride,
    ComposeDev,
    ComposeProxy,
    ComposeLocal,
)


class DreamDistModel(BaseModel):
    dist_path: str
    name: str
    dream_root: str
    pipeline_conf: PipelineConf = None
    compose_override: ComposeOverride = None
    compose_dev: ComposeDev = None
    compose_proxy: ComposeProxy = None
    compose_local: ComposeLocal = None


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
