from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    class Config:
        orm_mode = True


class UserCreate(UserBase):

    email: EmailStr
    sub: str
    picture: Optional[str]
    name: Optional[str]
    given_name: Optional[str]
    family_name: Optional[str]


class UserRead(UserCreate):
    id: int


class UserValidScheme(UserBase):

    refresh_token: str
    is_valid: bool
    expire_date: datetime


class UserModel(UserBase):
    id: int
    email: str
    sub: str
    picture: str
    fullname: str
    given_name: str
    family_name: str
