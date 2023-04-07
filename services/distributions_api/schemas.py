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


class VirtualAssistant(BaseOrmModel):
    id: int
    author: User
    source: str
    name: str
    display_name: str
    description: str
    date_created: datetime
    cloned_from_id: Optional[int]
    # clones: List[VirtualAssistant]


class EditAssistantDistModel(BaseModel):
    display_name: Optional[str]
    description: Optional[str]


class CreateAssistantDistModel(BaseModel):
    display_name: str
    description: str


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


class ComponentShort(BaseOrmModel):
    id: int
    name: str
    display_name: str
    component_type: Optional[COMPONENT_TYPES]
    model_type: Optional[MODEL_TYPES]
    is_customizable: bool
    author: User
    description: Optional[str]
    ram_usage: str
    gpu_usage: Optional[str]
    lm_service: Optional[str]
    date_created: datetime = Field(default_factory=datetime.utcnow)

    @validator("ram_usage", "gpu_usage")
    def check_memory_format(cls, v):
        check_memory_format(v)
        return v


class CreateVirtualAssistantComponentRequest(BaseModel):
    component_id: int


class VirtualAssistantComponentShort(BaseOrmModel):
    id: int
    component: ComponentShort
    is_enabled: bool


class DistComponentsResponse(BaseModel):
    annotators: List[VirtualAssistantComponentShort]
    skill_selectors: List[VirtualAssistantComponentShort]
    skills: List[VirtualAssistantComponentShort]
    candidate_annotators: List[VirtualAssistantComponentShort]
    response_selectors: List[VirtualAssistantComponentShort]
    response_annotators: List[VirtualAssistantComponentShort]


class CreateDialogSessionRequest(BaseModel):
    virtual_assistant_name: str


class DialogChatMessageRequest(BaseModel):
    text: str


class DialogChatMessageResponse(BaseModel):
    text: str


class DialogUtterance(BaseModel):
    author: str
    text: str


class ApiToken(BaseOrmModel):
    id: int
    name: str
    description: str
    base_url: str


class UserApiToken(BaseOrmModel):
    id: int
    user_id: int
    api_token: ApiToken
    token_value: str


class CreateTokenRequest(BaseModel):
    api_token_id: int
    token_value: str


class CreateTokenResponse(BaseModel):
    user_id: int
    api_token_id: int
    token_value: str


class LmService(BaseOrmModel):
    id: int
    name: str
    display_name: str
    description: str
    project_url: str


class SetLmServiceRequest(BaseModel):
    name: str


class Deployment(BaseOrmModel):
    id: int
    virtual_assistant_id: int
    chat_url: str
    prompt: Optional[str]
    lm_service: Optional[LmService]


class CreatePublishRequest(BaseOrmModel):
    is_prompt_visible: bool
    is_publicly_listed: bool


class Prompt(BaseModel):
    text: str


class DialogSession(BaseOrmModel):
    id: int
    user_id: int
    deployment: Deployment
    is_active: bool
