from datetime import datetime
from typing import Optional, List, Literal, Union

from deeppavlov_dreamtools.distconfigs.generics import (
    COMPONENT_TYPES,
    MODEL_TYPES,
    check_memory_format,
)
from pydantic import BaseModel, Field, validator, EmailStr

from database import enums

# PUBLISH_REQUEST_VISIBILITY_CHOICES = Literal["unlisted", "public_template", "public", "private"]


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


class ApiKeyRead(BaseOrmModel):
    id: int
    name: str
    display_name: str
    description: str
    base_url: str


class LmServiceRead(BaseOrmModel):
    id: int
    name: str
    display_name: str
    size: str
    gpu_usage: Optional[str]
    max_tokens: int
    description: str
    project_url: str
    api_key: Optional[ApiKeyRead]
    is_maintained: bool


class DeploymentBaseRead(BaseOrmModel):
    id: int
    chat_host: str
    chat_port: Optional[int]
    date_created: datetime
    state: Optional[enums.DeploymentState]
    error: Optional[dict]
    date_state_updated: Optional[datetime]
    stack_id: Optional[int]
    task_id: Optional[str]


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
    prompt_goals: Optional[str]
    lm_service: Optional[LmServiceRead]
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


class VirtualAssistantBaseRead(BaseOrmModel):
    id: int
    author: UserRead
    source: str
    name: str
    display_name: str
    description: str
    date_created: datetime
    visibility: Union[enums.VirtualAssistantPrivateVisibility, enums.VirtualAssistantPublicVisibility]
    publish_state: Optional[enums.PublishRequestState]
    cloned_from_id: Optional[int]
    required_api_keys: Optional[List[ApiKeyRead]]
    # clones: List[VirtualAssistant]

    @classmethod
    def from_orm(cls, obj):
        if obj.publish_request:
            obj.publish_state = obj.publish_request.state
            if obj.publish_request.state == enums.PublishRequestState.APPROVED:
                obj.visibility = obj.publish_request.public_visibility
            else:
                obj.visibility = obj.private_visibility
        else:
            obj.visibility = obj.private_visibility

        required_api_keys = []
        for c in obj.components:
            try:
                api_key = c.component.lm_service.api_key
                if api_key:
                    required_api_keys.append(api_key)
            except AttributeError:
                pass

        obj.required_api_keys = required_api_keys

        return super().from_orm(obj)


class VirtualAssistantRead(VirtualAssistantBaseRead):
    deployment: Optional[DeploymentBaseRead]


class VirtualAssistantCreate(BaseModel):
    display_name: str
    description: str


class VirtualAssistantUpdate(BaseModel):
    display_name: Optional[str]
    description: Optional[str]


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
    response_annotators: Optional[List[VirtualAssistantComponentRead]]


class DialogSessionCreate(BaseModel):
    virtual_assistant_name: str


class DialogChatMessageCreate(BaseModel):
    text: str
    prompt: Optional[str]
    lm_service_id: Optional[int]
    openai_api_key: Optional[str]


class DialogChatMessageRead(BaseModel):
    text: str
    active_skill: ComponentRead


class DialogUtteranceRead(BaseModel):
    author: str
    text: str
    active_skill: Optional[str]


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


class DeploymentRead(DeploymentBaseRead):
    virtual_assistant: VirtualAssistantBaseRead


class DeploymentCreate(BaseModel):
    virtual_assistant_name: str
    error: Optional[bool]


class PublishRequestRead(BaseOrmModel):
    id: int
    virtual_assistant: VirtualAssistantRead
    user: UserRead
    slug: str
    public_visibility: enums.VirtualAssistantPublicVisibility
    date_created: datetime
    is_confirmed: Optional[bool]
    reviewed_by_user: Optional[UserRead]
    date_reviewed: Optional[datetime]


class PublishRequestCreate(BaseOrmModel):
    visibility: Union[enums.VirtualAssistantPrivateVisibility, enums.VirtualAssistantPublicVisibility]


class DialogSessionRead(BaseOrmModel):
    id: int
    user_id: Optional[int]
    deployment: DeploymentRead
    is_active: bool
