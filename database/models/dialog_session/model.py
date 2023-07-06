from sqlalchemy import (
    Boolean,
    Column,
    Integer,
    String,
    ForeignKey,
)
from sqlalchemy.orm import relationship
from sqlalchemy.types import DateTime

from database.core import Base
from database.utils import DateTimeUtcNow


class DialogSession(Base):
    __tablename__ = "dialog_session"

    id = Column(Integer, index=True, primary_key=True)

    user_id = Column(Integer, ForeignKey("google_user.id", ondelete="CASCADE"))
    user = relationship("GoogleUser", uselist=False, foreign_keys="DialogSession.user_id")

    deployment_id = Column(Integer, ForeignKey("deployment.id", ondelete="CASCADE"), nullable=False)
    deployment = relationship("Deployment", uselist=False, foreign_keys="DialogSession.deployment_id")

    agent_dialog_id = Column(String)

    date_created = Column(DateTime, nullable=False, server_default=DateTimeUtcNow())
    is_active = Column(Boolean, nullable=False)
