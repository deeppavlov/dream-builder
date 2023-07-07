from typing import Union, Optional

from pydantic import BaseModel, EmailStr

import database.models


class BaseOrmModel(BaseModel):
    class Config:
        orm_mode = True


class User(BaseOrmModel):
    id: int
    email: Union[EmailStr, str, None]
    outer_id: str
    picture: Optional[str]
    name: Optional[str]

    @classmethod
    def from_orm(cls, obj: database.models.GeneralUser):
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
        return super().from_orm(obj)