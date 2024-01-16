from sqlalchemy import (
    Boolean,
    Column,
    Integer,
    String,
    ForeignKey,
    Enum,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.event import listens_for
from sqlalchemy.ext import mutable
from sqlalchemy.orm import relationship
from sqlalchemy.types import DateTime

from apiconfig.config import settings
from database.core import Base
from database.utils import DateTimeUtcNow, pre_populate_from_tsv


class Component(Base):
    __tablename__ = "component"

    id = Column(Integer, index=True, primary_key=True)
    source = Column(String, nullable=False, unique=True)
    name = Column(String, nullable=False)
    display_name = Column(String, nullable=False)
    component_type = Column(String, nullable=True)
    model_type = Column(String, nullable=True)
    is_customizable = Column(Boolean, nullable=False)

    author_id = Column(Integer, ForeignKey("user.id", ondelete="CASCADE"), nullable=False)
    author = relationship("GeneralUser", back_populates="components")

    description = Column(String, nullable=True)

    ram_usage = Column(String, nullable=True)
    gpu_usage = Column(String, nullable=True)

    group = Column(String, nullable=False)

    service_id = Column(Integer, ForeignKey("service.id", ondelete="CASCADE"), nullable=False)
    service = relationship("Service", back_populates="components")
    endpoint = Column(String)

    prompt = Column(String, nullable=True)
    prompt_goals = Column(String, nullable=True)
    lm_service_id = Column(Integer, ForeignKey("lm_service.id"), nullable=True)
    lm_service = relationship("LmService", uselist=False, foreign_keys="Component.lm_service_id")
    lm_config = Column(mutable.MutableDict.as_mutable(JSONB), nullable=True)

    creation_type = Column(
        Enum("new", "assistant_clone", "component_clone", name="creation_status_enum"),
        nullable=True, default="new"
    )
    cloned_from_id = Column(Integer, nullable=True)

    date_created = Column(DateTime, nullable=False, server_default=DateTimeUtcNow())


@listens_for(Component.__table__, "after_create")
def pre_populate_component(target, connection, **kw):
    pre_populate_from_tsv(
        settings.db.initial_data_dir / "component.tsv",
        target,
        connection,
        map_value_types={"is_customizable": lambda x: bool(int(x))},
    )
