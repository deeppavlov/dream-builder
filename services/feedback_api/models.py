from datetime import datetime
from typing import List
from pydantic import BaseModel, EmailStr

from services.shared.user import User


class PictureCreate(BaseModel):
    picture: bytes


class FeedbackType(BaseModel):
    id: int
    name: str


class FeedbackStatus(BaseModel):
    id: int
    name: str


class FeedbackCreate(BaseModel):
    feedback_type: FeedbackType
    email: EmailStr
    text: str
    pictures: List[bytes] = []


class PictureResponse(BaseModel):
    id: int
    picture: bytes


class FeedbackResponse(BaseModel):
    id: int
    feedback_type: FeedbackType
    status: FeedbackStatus
    email: EmailStr
    text: str
    pictures: List[dict] = []
    date_created: datetime


class RoleRead(BaseModel):
    id: int
    name: str

    can_view_private_assistants: bool
    can_confirm_publish: bool
    can_set_roles: bool


class UserRead(User):
    role: RoleRead
