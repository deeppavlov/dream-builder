from database.core import Base
from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.types import DateTime


class UnauthUserValid(Base):
    """
    Unauthorized
    """

    __tablename__ = "unauth_uservalid"

    id = Column(Integer, index=True, primary_key=True)
    user_id = Column(Integer, ForeignKey("user.id", ondelete="CASCADE"), nullable=False)
    token = Column(String, unique=True)
    is_valid = Column(Boolean, nullable=False)
    expire_date = Column(DateTime, nullable=False)
