from datetime import datetime
from typing import List
from pydantic import BaseModel, EmailStr


class PictureCreate(BaseModel):
    picture: bytes


class FeedbackCreate(BaseModel):
    email: EmailStr
    text: str
    pictures: List[bytes] = []


class PictureResponse(BaseModel):
    id: int
    picture: bytes


class FeedbackResponse(BaseModel):
    id: int
    email: EmailStr
    text: str
    pictures: List[dict] = []
    date_created: datetime