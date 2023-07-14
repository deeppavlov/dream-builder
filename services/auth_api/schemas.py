from typing import Optional

from pydantic import ConfigDict, BaseModel, EmailStr


class BaseOrmModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class RoleRead(BaseOrmModel):
    id: int
    name: str

    can_view_private_assistants: bool
    can_confirm_publish: bool
    can_set_roles: bool


class User(BaseOrmModel):
    id: int
    email: EmailStr
    sub: str
    role: RoleRead
    picture: Optional[str] = None
    fullname: Optional[str] = None
    given_name: Optional[str] = None
    family_name: Optional[str] = None
