from sqlalchemy import (
    Boolean,
    Column,
    Integer,
    String,
    ForeignKey,
)
from sqlalchemy.types import DateTime

from database.core import Base


class UserValid(Base):
    __tablename__ = "user_valid"

    id = Column(Integer, index=True, primary_key=True)
    user_id = Column(Integer, ForeignKey("google_user.id", ondelete="CASCADE"))
    refresh_token = Column(String, unique=True)
    is_valid = Column(Boolean, nullable=False)
    expire_date = Column(DateTime, nullable=False)
