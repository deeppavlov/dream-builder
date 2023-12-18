from typing import Union, Optional

from pydantic import BaseModel, EmailStr

from database.models.user import GeneralUser


class BaseOrmModel(BaseModel):
    class Config:
        orm_mode = True


class RoleRead(BaseOrmModel):
    id: int
    name: str

    can_view_private_assistants: bool
    can_confirm_publish: bool
    can_set_roles: bool


class User(BaseOrmModel):
    id: int
    email: Union[EmailStr, str, None]
    outer_id: str
    picture: Optional[str]
    name: Optional[str]
    role: RoleRead
    first_auth: Optional[bool]

    @classmethod
    def from_orm(cls, obj: GeneralUser):
        if obj.unauth_user:
            obj.email, obj.picture, obj.name = "", "", ""
            obj.role = obj.unauth_user.role
            return super().from_orm(obj)

        user = None
        for user_provider in [obj.google_user, obj.github_user]:
            if user_provider:
                user = user_provider
                break

        if user is None:
            raise ValueError("No attached users to the account")

        obj.email = user.email
        obj.picture = user.picture
        obj.name = user.fullname if hasattr(user, "fullname") else user.name
        obj.role = user.role
        return super().from_orm(obj)
