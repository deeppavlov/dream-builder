from typing import Union, Optional

from pydantic import BaseModel, Field, validator, EmailStr


class BaseOrmModel(BaseModel):
    class Config:
        orm_mode = True


class User(BaseOrmModel):
    id: int
    email: Union[EmailStr, str, None]
    outer_id: str
    picture: Optional[str]
    name: Optional[str]


class UserToken(User):
    token: str
    refresh_token: Optional[str]

