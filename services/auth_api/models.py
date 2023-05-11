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


class UserModel(UserBase):
    id: int
    email: str
    sub: str
    picture: str
    fullname: str
    given_name: str
    family_name: str


class GithubUserCreate(UserBase):
    email: Optional[EmailStr]
    github_id: str
    picture: str
    name: str


class GithubUser(GithubUserCreate):
    id: int


class GithubUserValidCreate(UserBase):
    user_id: str
    access_token: str
    is_valid: bool
    expire_date: datetime
