from pydantic import BaseModel


class UserBase(BaseModel):
    class Config:
        orm_mode = True


class User(UserBase):
    id: int
    email: str
    full_name: str | None = None


class UserInDB(User):
    hashed_password: str


class UserToDB(UserBase):
    email: str
    hashed_password: str
    full_name: str = ""


class UserCreate(BaseModel):
    email: str
    password: str

    class Config:
        orm_mode = True
