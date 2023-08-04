from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    Boolean,
)
from sqlalchemy.event import listens_for
from sqlalchemy.orm import relationship, backref
from sqlalchemy.sql import sqltypes
from sqlalchemy.types import DateTime

from apiconfig.config import settings
from database import enums
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

    language_id = Column(Integer, ForeignKey("language.id"), nullable=False)
    language = relationship("Language")

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
    is_visible = Column(Boolean, nullable=False, default=True)


@listens_for(VirtualAssistant.__table__, "after_create")
def pre_populate_virtual_assistant(target, connection, **kw):
    pre_populate_from_tsv(
        settings.db.initial_data_dir / "virtual_assistant.tsv",
        target,
        connection,
        map_value_types={"is_visible": lambda x: bool(int(x))},
    )
