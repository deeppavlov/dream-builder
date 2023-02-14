from datetime import datetime
from typing import Optional, List

from pydantic import BaseModel

from deeppavlov_dreamtools.distconfigs.generics import AnyConfig
from deeppavlov_dreamtools.distconfigs.generics import (
    PipelineConf,
    ComposeOverride,
    ComposeDev,
    ComposeProxy,
    ComposeLocal,
    Component,
    ComponentMetadata,
    PipelineConfMetadata,
)


class CreateAssistantDistModel(BaseModel):
    display_name: str
    description: str


class CloneAssistantDistModel(CreateAssistantDistModel):
    annotators: Optional[List[str]]
    response_annotators: Optional[List[str]]
    # response_annotator_selectors: Optional[bool]
    candidate_annotators: Optional[List[str]]
    skill_selectors: Optional[List[str]]
    skills: Optional[List[str]]
    response_selectors: Optional[List[str]]


class DreamDistModelMetadata(BaseModel):
    display_name: str
    author: str
    description: str
    version: str
    date: datetime
    ram_usage: str
    gpu_usage: str
    disk_usage: str


class DreamDistModelShort(PipelineConfMetadata):
    name: str


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


class ComponentShort(ComponentMetadata):
    name: str
