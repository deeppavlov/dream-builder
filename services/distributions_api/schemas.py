from datetime import datetime
from typing import Optional, List, Literal, Union

from deeppavlov_dreamtools.distconfigs.generics import (
    COMPONENT_TYPES,
    MODEL_TYPES,
    check_memory_format,
)
from pydantic import BaseModel, Field, validator, EmailStr
from services.shared.user import User
from sqlalchemy.ext.associationproxy import _AssociationList

from database import enums


# PUBLISH_REQUEST_VISIBILITY_CHOICES = Literal["unlisted", "public_template", "public", "private"]


class BaseOrmModel(BaseModel):
    class Config:
        orm_mode = True


class RoleRead(BaseOrmModel):
    id: int
    name: str

    can_view_private_assistants: bool
    can_confirm_publish: bool
    can_set_roles: bool


class UserRead(User):
    role: RoleRead


class LanguageRead(BaseOrmModel):
    id: int
    value: str


class ApiKeyRead(BaseOrmModel):
    id: int
    name: str
    display_name: str
    description: str
    base_url: str


class PromptBlockRead(BaseOrmModel):
    id: int
    category: Optional[str] = None
    display_name: str
    template: str
    example: str
    description: str
    newline_before: bool
    newline_after: bool


class LmServiceRead(BaseOrmModel):
    id: int
    name: str
    display_name: str
    size: str
    gpu_usage: Optional[str]
    max_tokens: int
    description: str
    project_url: str
    api_key: Optional[ApiKeyRead] = None
    prompt_blocks: Optional[list[PromptBlockRead]] = None
    is_hosted: bool
    is_maintained: bool
    languages: List[LanguageRead]

    @validator("prompt_blocks", "languages", pre=True)
    def cast_associations_to_list(cls, v):
        if isinstance(v, _AssociationList):
            return list(v)
        return v


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
    source: str
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
    lm_config: Optional[dict]
    date_created: datetime = Field(default_factory=datetime.utcnow)

    @validator("ram_usage", "gpu_usage")
    def check_memory_format(cls, v):
        check_memory_format(v)
        return v


class ComponentGenerativeRead(BaseOrmModel):
    id: int
    prompt: Optional[str]
    lm_service: Optional[LmServiceRead]
    lm_config: Optional[dict]


class ComponentCreate(BaseModel):
    display_name: str = Field(..., examples=["Recipe Generator"])
    description: Optional[str] = Field(None, examples=["Generates recipes based on your ingredients"])
    prompt: Optional[str] = Field(
        None, examples=["Your task is to generate a recipe for a salad when the user gives you an ingredient list"]
    )
    prompt_goals: Optional[str] = Field(None, examples=["Generates salad recipes"])
    lm_service_id: Optional[int] = Field(None, examples=[13])
    lm_config: Optional[dict] = Field(
        None,
        examples=[
            {
                "do_sample": True,
                "num_beams": 2,
                "max_new_tokens": 200,
                "min_new_tokens": 8,
                "num_return_sequences": 2,
            }
        ],
    )


class ComponentUpdate(BaseModel):
    display_name: Optional[str] = Field(None, examples=["Recipe Generator 2.0"])
    description: Optional[str] = Field(None, examples=["Generates awesome recipes based on your ingredients"])
    prompt: Optional[str] = Field(
        None, examples=["Your task is to generate a recipe for a soup when the user gives you an ingredient list"]
    )
    lm_service_id: Optional[int] = Field(None, examples=[4])
    lm_config: Optional[dict] = Field(
        None,
        examples=[
            {
                "top_p": 1.0,
                "max_tokens": 64,
                "temperature": 0.4,
                "presence_penalty": 0,
                "frequency_penalty": 0,
            }
        ],
    )


class VirtualAssistantBaseRead(BaseOrmModel):
    id: int
    author: UserRead
    source: str
    name: str
    display_name: str
    description: str
    language: LanguageRead
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
    display_name: str = Field(..., examples=["Sous-chef Assistant"])
    description: str = Field(
        ..., examples=["This assistant will help you create recipe ideas based on the ingredients you have"]
    )
    language: Optional[Literal["en", "ru"]] = Field(None, examples=["en"])


class VirtualAssistantUpdate(BaseModel):
    display_name: Optional[str] = Field(None, examples=["New Display Name"])
    description: Optional[str] = Field(None, examples=["Updated description"])


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

    @classmethod
    def from_orm(cls, obj):
        obj.name = obj.component.name
        obj.display_name = obj.component.display_name
        obj.component_type = obj.component.component_type
        obj.model_type = obj.component.model_type
        obj.is_customizable = obj.component.is_customizable
        obj.author = obj.component.author
        obj.description = obj.component.description
        obj.ram_usage = obj.component.ram_usage
        obj.gpu_usage = obj.component.gpu_usage
        obj.prompt = obj.component.prompt
        obj.lm_service = obj.component.lm_service
        obj.date_created = obj.component.date_created

        return super().from_orm(obj)


class VirtualAssistantComponentPipelineRead(BaseModel):
    annotators: List[VirtualAssistantComponentRead]
    skill_selectors: List[VirtualAssistantComponentRead]
    skills: List[VirtualAssistantComponentRead]
    candidate_annotators: List[VirtualAssistantComponentRead]
    response_selectors: List[VirtualAssistantComponentRead]
    response_annotators: Optional[List[VirtualAssistantComponentRead]]


class DialogSessionCreate(BaseModel):
    virtual_assistant_name: str = Field(..., examples=["ff99abcd"])


class DialogChatMessageCreate(BaseModel):
    text: str = Field(..., examples=["who are you?"])
    prompt: Optional[str]
    lm_service_id: Optional[int]
    openai_api_key: Optional[str]


class DialogChatMessageRead(BaseModel):
    text: str
    active_skill: ComponentRead


class DialogUtteranceRead(BaseModel):
    author: str
    text: str
    active_skill: Optional[ComponentRead]


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
    virtual_assistant_name: str = Field(..., examples=["ff99abcd"])


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
    visibility: Union[enums.VirtualAssistantPrivateVisibility, enums.VirtualAssistantPublicVisibility] = Field(
        ..., examples=[enums.VirtualAssistantPrivateVisibility.UNLISTED_LINK]
    )


class DialogSessionRead(BaseOrmModel):
    id: int
    user_id: Optional[int]
    agent_dialog_id: Optional[str]
    deployment: DeploymentRead
    is_active: bool
