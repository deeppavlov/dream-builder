from typing import Optional

from pydantic import BaseModel, EmailStr


class BaseOrmModel(BaseModel):
    class Config:
        orm_mode = True


class RoleRead(BaseOrmModel):
    id: int
    name: str

    can_view_private_assistants: bool
    can_confirm_publish: bool
    can_set_roles: bool


class PlanRead(BaseOrmModel):
    id: int
    name: str

    max_active_assistants: int
    price: int


class User(BaseOrmModel):
    id: int
    email: EmailStr
    sub: str
    role: RoleRead
    plan: PlanRead
    picture: Optional[str]
    fullname: Optional[str]
    given_name: Optional[str]
    family_name: Optional[str]
