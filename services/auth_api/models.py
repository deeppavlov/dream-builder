from datetime import datetime
from typing import Optional

from pydantic import ConfigDict, BaseModel, EmailStr


class UserBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class UserCreate(UserBase):

    email: EmailStr
    sub: str
    picture: Optional[str] = None
    name: Optional[str] = None
    given_name: Optional[str] = None
    family_name: Optional[str] = None


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
