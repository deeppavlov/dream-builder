from database.core import Base
from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.types import DateTime


class GithubUserValid(Base):
    """
    Even though the table fields are almost identical to UserValid (`user_valid`). It is recommended not to mix
    those table as they used for different type of authorization.
    """

    __tablename__ = "github_uservalid"

    id = Column(Integer, index=True, primary_key=True)
    user_id = Column(Integer, ForeignKey("user.id", ondelete="CASCADE"), nullable=False)
    access_token = Column(String, unique=True)
    is_valid = Column(Boolean, nullable=False)
    expire_date = Column(DateTime, nullable=False)
