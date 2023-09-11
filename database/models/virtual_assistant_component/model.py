from apiconfig.config import settings
from database.core import Base
from database.utils import pre_populate_from_tsv
from sqlalchemy import Boolean, Column, ForeignKey, Integer
from sqlalchemy.event import listens_for
from sqlalchemy.orm import relationship


class VirtualAssistantComponent(Base):
    __tablename__ = "virtual_assistant_component"

    id = Column(Integer, index=True, primary_key=True)

    virtual_assistant_id = Column(Integer, ForeignKey("virtual_assistant.id", ondelete="CASCADE"), nullable=False)
    virtual_assistant = relationship("VirtualAssistant")

    component_id = Column(Integer, ForeignKey("component.id", ondelete="CASCADE"), nullable=False)
    component = relationship("Component")

    is_enabled = Column(Boolean, nullable=False)


@listens_for(VirtualAssistantComponent.__table__, "after_create")
def pre_populate_virtual_assistant_component(target, connection, **kw):
    pre_populate_from_tsv(
        settings.db.initial_data_dir / "virtual_assistant_component.tsv",
        target,
        connection,
        map_value_types={"is_enabled": lambda x: bool(int(x))},
    )
