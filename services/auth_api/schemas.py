from typing import Optional

from pydantic import BaseModel, EmailStr


class BaseOrmModel(BaseModel):
    class Config:
        orm_mode = True


class User(BaseOrmModel):
    id: int
    email: EmailStr
    sub: str
    picture: Optional[str]
    fullname: Optional[str]
    given_name: Optional[str]
    family_name: Optional[str]
