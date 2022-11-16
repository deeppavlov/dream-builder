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
    family_name: str
