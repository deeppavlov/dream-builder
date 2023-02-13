from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    class Config:
        orm_mode = True


class UserCreate(UserBase):

    email: EmailStr
    sub: str
    picture: str
    name: str
    given_name: str
    family_name: Optional[str]


class User(UserCreate):
    pass


class UserValidScheme(UserBase):

    refresh_token: str
    is_valid: bool
    expire_date: datetime
