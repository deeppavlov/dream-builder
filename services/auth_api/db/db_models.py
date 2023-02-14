from sqlalchemy import Boolean, Column, Integer, String, ForeignKey, DateTime

from services.auth_api.db.db import Base


class GoogleUser(Base):
    __tablename__ = "google_user"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True)
    sub = Column(String)
    picture = Column(String(500), nullable=True)
    fullname = Column(String(100))
    given_name = Column(String(50))
    family_name = Column(String(50))


class UserValid(Base):
    __tablename__ = "user_valid"

    id = Column(Integer, index=True, primary_key=True)
    user_id = Column(Integer, ForeignKey("google_user.id"))
    refresh_token = Column(String, unique=True)
    is_valid = Column(Boolean, nullable=False)
    expire_date = Column(DateTime, nullable=False)
