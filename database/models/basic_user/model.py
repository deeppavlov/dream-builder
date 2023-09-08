from database.core import Base
from database.utils import DateTimeUtcNow
from sqlalchemy import Column, ForeignKey, Integer, Sequence, String
from sqlalchemy.orm import relationship
from sqlalchemy.types import DateTime


class BasicUser(Base):
    __tablename__ = "basic_user"

    id = Column(
        Integer,
        Sequence("basic_user_id_seq", start=3, increment=1),
        primary_key=True,
        index=True,
    )
    user_id = Column(Integer, ForeignKey("user.id", ondelete="CASCADE"), nullable=False)
    email = Column(String)
    token = Column(String)

    date_created = Column(DateTime, nullable=False, server_default=DateTimeUtcNow())

    role_id = Column(Integer, ForeignKey("role.id"), nullable=False)
    role = relationship("Role")
