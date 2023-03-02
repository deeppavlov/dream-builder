import os
from pathlib import Path
from typing import Literal

from deeppavlov_dreamtools.distconfigs.assistant_dists import (
    DreamComposeDev,
    DreamComposeOverride,
    DreamComposeProxy,
    DreamPipeline,
)
from deeppavlov_dreamtools.distconfigs.generics import (
    PipelineConfModel,
    ComposeOverride,
    ComposeDev,
    ComposeProxy,
)


DREAM_ROOT_PATH = Path(os.environ["DREAM_ROOT_PATH"])

AUTH_URL = "http://auth-api:6000/auth/token"

ASSISTANT_DISTS_PATH = DREAM_ROOT_PATH / "assistant_dists"

DreamConfigLiteral = Literal["pipeline_conf", "compose_override", "compose_dev", "compose_proxy"]

CONFIGNAME_DREAMOBJECT = {
    "pipeline_conf": DreamPipeline,
    "compose_override": DreamComposeOverride,
    "compose_dev": DreamComposeDev,
    "compose_proxy": DreamComposeProxy,
}

CONFIGNAME_CONFIGOBJECT = {
    "pipeline_conf": PipelineConfModel,
    "compose_override": ComposeOverride,
    "compose_dev": ComposeDev,
    "compose_proxy": ComposeProxy,
}
