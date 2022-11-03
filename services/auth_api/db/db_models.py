from pydantic import BaseModel


class User(BaseModel):
    id: int
    email: str
    username: str | None = None
    full_name: str | None = None
    disabled: bool | None = None

    class Config:
        orm_mode = True


class UserInDB(User):
    hashed_password: str

class UserCreate(BaseModel):
    email: str
    password: str
