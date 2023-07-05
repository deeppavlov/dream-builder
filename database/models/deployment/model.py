from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.event import listens_for
from sqlalchemy.ext import mutable
from sqlalchemy.orm import relationship
from sqlalchemy.sql import sqltypes
from sqlalchemy.types import DateTime

from apiconfig.config import settings
from database import enums
from database.core import Base
from database.utils import DateTimeUtcNow, pre_populate_from_tsv


class Deployment(Base):
    __tablename__ = "deployment"

    id = Column(Integer, index=True, primary_key=True)

    virtual_assistant_id = Column(
        Integer, ForeignKey("virtual_assistant.id", ondelete="CASCADE"), nullable=False, unique=True
    )
    virtual_assistant = relationship("VirtualAssistant", uselist=False, foreign_keys="Deployment.virtual_assistant_id")

    chat_host = Column(String, nullable=False)
    chat_port = Column(Integer, nullable=True)

    date_created = Column(DateTime, nullable=False, server_default=DateTimeUtcNow())

    stack_id = Column(Integer, nullable=True)
    task_id = Column(String, nullable=True)
    date_state_updated = Column(DateTime, nullable=True, onupdate=DateTimeUtcNow())
    state = Column(sqltypes.Enum(enums.DeploymentState), nullable=True)
    error = Column(mutable.MutableDict.as_mutable(JSONB), nullable=True)


@listens_for(Deployment.__table__, "after_create")
def pre_populate_deployment(target, connection, **kw):
    pre_populate_from_tsv(settings.db.initial_data_dir / "deployment.tsv", target, connection)
