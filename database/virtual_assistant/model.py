import json
import logging
from pathlib import Path
from typing import Union, Dict, Type, Callable

from sqlalchemy import (
    Boolean,
    Column,
    Integer,
    String,
    ForeignKey,
    JSON,
    TypeDecorator,
    VARCHAR,
    UniqueConstraint,
)
from sqlalchemy.dialects.postgresql import insert, JSONB
from sqlalchemy.event import listens_for
from sqlalchemy.ext import mutable
from sqlalchemy.ext.compiler import compiles
from sqlalchemy.orm import relationship, backref
from sqlalchemy.sql import expression, sqltypes
from sqlalchemy.types import DateTime

from apiconfig.config import settings
from database import utils, enums
from database.core import Base
from database.utils import DateTimeUtcNow, pre_populate_from_tsv


class VirtualAssistant(Base):
    __tablename__ = "virtual_assistant"

    id = Column(Integer, index=True, primary_key=True)

    cloned_from_id = Column(Integer, ForeignKey("virtual_assistant.id", ondelete="SET NULL"), nullable=True)
    clones = relationship("VirtualAssistant", backref=backref("cloned_from", remote_side=[id]))

    author_id = Column(Integer, ForeignKey("google_user.id", ondelete="CASCADE"), nullable=False)
    author = relationship("GoogleUser", back_populates="virtual_assistants")

    source = Column(String, nullable=False)
    name = Column(String, unique=True, nullable=False)
    display_name = Column(String, nullable=False)
    description = Column(String, nullable=False)
    private_visibility = Column(
        sqltypes.Enum(enums.VirtualAssistantPrivateVisibility),
        nullable=False,
        server_default=enums.VirtualAssistantPrivateVisibility.PRIVATE.value,
    )
    date_created = Column(DateTime, nullable=False, server_default=DateTimeUtcNow())

    components = relationship(
        "VirtualAssistantComponent", uselist=True, back_populates="virtual_assistant", passive_deletes=True
    )
    publish_request = relationship(
        "PublishRequest", uselist=False, back_populates="virtual_assistant", passive_deletes=True
    )
    deployment = relationship("Deployment", uselist=False, back_populates="virtual_assistant", passive_deletes=True)


@listens_for(VirtualAssistant.__table__, "after_create")
def pre_populate_virtual_assistant(target, connection, **kw):
    pre_populate_from_tsv(settings.db.initial_data_dir / "virtual_assistant.tsv", target, connection)
