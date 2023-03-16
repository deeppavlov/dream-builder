from datetime import datetime
from typing import Optional, List

from pydantic import BaseModel, Field, validator, EmailStr

from deeppavlov_dreamtools.distconfigs.generics import (
    AnyConfig,
    COMPONENT_TYPES,
    MODEL_TYPES,
    ComponentEndpoint,
    check_memory_format,
)
from deeppavlov_dreamtools.distconfigs.generics import (
    PipelineConfModel,
    ComposeOverride,
    ComposeDev,
    ComposeProxy,
    ComposeLocal,
    Component,
    PipelineConfMetadata,
)


class BaseOrmModel(BaseModel):
    class Config:
        orm_mode = True


class User(BaseOrmModel):
    id: int
    email: EmailStr
    sub: str
    picture: Optional[str]
    fullname: Optional[str]
    given_name: Optional[str]
    family_name: Optional[str]


class EditAssistantDistModel(BaseModel):
    display_name: Optional[str]
    description: Optional[str]


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


class AssistantDistModelMetadata(BaseModel):
    display_name: str
    author: str
    description: str
    version: str
    date: datetime
    ram_usage: str
    gpu_usage: str
    disk_usage: str


class AssistantDistModelShort(PipelineConfMetadata):
    name: str


class AssistantDistModel(BaseModel):
    dist_path: str
    name: str
    dream_root: str
    pipeline_conf: PipelineConfModel = None
    compose_override: ComposeOverride = None
    compose_dev: ComposeDev = None
    compose_proxy: ComposeProxy = None
    compose_local: ComposeLocal = None


class AssistantDistChatRequest(BaseModel):
    text: str


class AssistantDistChatResponse(BaseModel):
    text: str


class AssistantDistConfigsImport(BaseModel):
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


class ComponentShort(BaseModel):
    name: str
    display_name: str
    component_type: Optional[COMPONENT_TYPES]
    model_type: MODEL_TYPES
    is_customizable: bool
    author: str
    description: str
    ram_usage: str
    gpu_usage: Optional[str]
    date_created: datetime = Field(default_factory=datetime.utcnow)

    @validator("ram_usage", "gpu_usage")
    def check_memory_format(cls, v):
        check_memory_format(v)
        return v


class DistComponentsResponse(BaseModel):
    annotators: List[ComponentShort]
    skill_selectors: List[ComponentShort]
    skills: List[ComponentShort]
    candidate_annotators: List[ComponentShort]
    response_selectors: List[ComponentShort]
    response_annotators: List[ComponentShort]


class ApiToken(BaseOrmModel):
    id: int
    name: str
    description: str
    base_url: str


class UserApiToken(BaseOrmModel):
    id: int
    user_id: int
    api_token_id: int
    token_value: str


class CreateTokenRequest(BaseModel):
    api_token_id: int
    token_value: str


class CreateTokenResponse(BaseModel):
    user_id: int
    api_token_id: int
    token_value: str
