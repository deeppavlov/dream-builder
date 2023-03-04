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

INVISIBLE_DIST_NAMES = [
    "deepy_faq",
    "dream_sfc",
    "deepy_gobot_base",
    "dream_alice",
    "dream",
    "dream_multimodal",
    "deepy_base",
    "roomful",
    "deepy_adv",
    "dream_russian",
    "dream_persona_prompted",
    "dream_minecraft",
    "dream_weather",
    "dream_multilingual",
    "dream_mini_persona_based",
    "dream_mini",
    "dream_alexa",
]
