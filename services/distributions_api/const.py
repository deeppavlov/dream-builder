from pathlib import Path
from typing import Literal

from deeppavlov_dreamtools.distconfigs.manager import (
    DreamComposeDev,
    DreamComposeOverride,
    DreamComposeProxy,
    DreamPipeline,
)

DREAM_ROOT_PATH = Path(__file__).parents[4] / "dream"  # TODO: transfer to system env or to .env file

ASSISTANT_DISTS_PATH = DREAM_ROOT_PATH / "assistant_dists"

DreamConfigLiteral = Literal["pipeline_conf", "compose_override", "compose_dev", "compose_proxy", "compose_local"]
ConfigClassLiteral = Literal["DreamPipeline", "DreamComposeOverride", "DreamComposeDev", "DreamComposeProxy"]

CONFIG_NAME_OBJECT = {
    "DreamPipeline": DreamPipeline,
    "DreamComposeOverride": DreamComposeOverride,
    "DreamComposeDev": DreamComposeDev,
    "DreamComposeProxy": DreamComposeProxy,
}
