from datetime import datetime
from typing import Optional, List, Literal

from deeppavlov_dreamtools.distconfigs.generics import (
    COMPONENT_TYPES,
    MODEL_TYPES,
    check_memory_format,
)
from pydantic import BaseModel, Field, validator, EmailStr

PUBLISH_REQUEST_VISIBILITY_CHOICES = Literal["unlisted", "public_template", "public", "private"]


class BaseOrmModel(BaseModel):
    class Config:
        orm_mode = True


class UserRead(BaseOrmModel):
    id: int
    email: EmailStr
    sub: str
    picture: Optional[str]
    fullname: Optional[str]
    given_name: Optional[str]
    family_name: Optional[str]


class VirtualAssistantRead(BaseOrmModel):
    id: int
    author: UserRead
    source: str
    name: str
    display_name: str
    description: str
    date_created: datetime
    visibility: PUBLISH_REQUEST_VISIBILITY_CHOICES
    publish_state: Optional[Literal["confirmed", "rejected", "in_progress"]]
    cloned_from_id: Optional[int]
    # clones: List[VirtualAssistant]

    @classmethod
    def from_orm(cls, obj):
        try:
            if obj.publish_request.is_confirmed is None:
                obj.visibility = "private"
                obj.publish_state = "in_progress"
            elif obj.publish_request.is_confirmed:
                obj.visibility = obj.publish_request.visibility
                obj.publish_state = "confirmed"
            else:
                obj.visibility = "private"
                obj.publish_state = "rejected"
        except AttributeError:
            obj.visibility = "private"
            obj.publish_state = None

        return super().from_orm(obj)


class VirtualAssistantCreate(BaseModel):
    display_name: str
    description: str


class VirtualAssistantUpdate(BaseModel):
    display_name: Optional[str]
    description: Optional[str]


class LmServiceRead(BaseOrmModel):
    id: int
    name: str
    display_name: str
    size: str
    gpu_usage: Optional[str]
    max_tokens: int
    description: str
    project_url: str


class ComponentRead(BaseOrmModel):
    id: int
    name: str
    display_name: str
    component_type: Optional[COMPONENT_TYPES]
    model_type: Optional[MODEL_TYPES]
    is_customizable: bool
    author: UserRead
    description: Optional[str]
    ram_usage: Optional[str]
    gpu_usage: Optional[str]
    prompt: Optional[str]
    lm_service_id: Optional[int]
    date_created: datetime = Field(default_factory=datetime.utcnow)

    @validator("ram_usage", "gpu_usage")
    def check_memory_format(cls, v):
        check_memory_format(v)
        return v


class ComponentGenerativeRead(BaseOrmModel):
    id: int
    prompt: Optional[str]
    lm_service: Optional[LmServiceRead]


class ComponentCreate(BaseModel):
    display_name: str
    description: Optional[str]
    prompt: Optional[str]
    lm_service_id: Optional[int]


class ComponentUpdate(BaseModel):
    display_name: Optional[str]
    description: Optional[str]
    prompt: Optional[str]
    lm_service_id: Optional[int]


class CreateVirtualAssistantComponentRequest(BaseModel):
    component_id: int


class VirtualAssistantComponentRead(BaseOrmModel):
    id: int
    component_id: int
    name: str
    display_name: str
    component_type: Optional[COMPONENT_TYPES]
    model_type: Optional[MODEL_TYPES]
    is_customizable: bool
    author: UserRead
    description: Optional[str]
    ram_usage: Optional[str]
    gpu_usage: Optional[str]
    prompt: Optional[str]
    lm_service: Optional[LmServiceRead]
    date_created: datetime = Field(default_factory=datetime.utcnow)
    is_enabled: bool

    @validator("ram_usage", "gpu_usage")
    def check_memory_format(cls, v):
        check_memory_format(v)
        return v


class VirtualAssistantComponentPipelineRead(BaseModel):
    annotators: List[VirtualAssistantComponentRead]
    skill_selectors: List[VirtualAssistantComponentRead]
    skills: List[VirtualAssistantComponentRead]
    candidate_annotators: List[VirtualAssistantComponentRead]
    response_selectors: List[VirtualAssistantComponentRead]
    response_annotators: List[VirtualAssistantComponentRead]


class DialogSessionCreate(BaseModel):
    virtual_assistant_name: str


class DialogChatMessageCreate(BaseModel):
    text: str
    prompt: Optional[str]
    lm_service_id: Optional[int]
    openai_api_key: Optional[str]


class DialogChatMessageRead(BaseModel):
    text: str


class DialogUtteranceRead(BaseModel):
    author: str
    text: str


class ApiKeys(BaseOrmModel):
    id: int
    name: str
    description: str
    base_url: str


# class UserApiToken(BaseOrmModel):
#     id: int
#     user_id: int
#     api_token: ApiKeys
#     token_value: str


class CreateTokenRequest(BaseModel):
    api_token_id: int
    token_value: str


class CreateTokenResponse(BaseModel):
    user_id: int
    api_token_id: int
    token_value: str


class DeploymentRead(BaseOrmModel):
    id: int
    virtual_assistant: VirtualAssistantRead
    chat_host: str
    chat_port: int
    date_created: datetime
    state: Optional[str]
    date_state_updated: Optional[datetime]


class DeploymentCreate(BaseModel):
    virtual_assistant_id: int


class PublishRequestRead(BaseOrmModel):
    id: int
    virtual_assistant: VirtualAssistantRead
    user: UserRead
    slug: str
    visibility: PUBLISH_REQUEST_VISIBILITY_CHOICES
    date_created: datetime
    is_confirmed: Optional[bool]
    reviewed_by_user: Optional[UserRead]
    date_reviewed: Optional[datetime]


class PublishRequestCreate(BaseOrmModel):
    visibility: PUBLISH_REQUEST_VISIBILITY_CHOICES


class DialogSessionRead(BaseOrmModel):
    id: int
    user_id: int
    deployment: DeploymentRead
    is_active: bool
