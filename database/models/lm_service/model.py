from sqlalchemy import (
    Boolean,
    Column,
    Integer,
    String,
    ForeignKey,
)
from sqlalchemy.event import listens_for
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.orm import relationship

from apiconfig.config import settings
from database.core import Base
from database.utils import pre_populate_from_tsv


class LmService(Base):
    __tablename__ = "lm_service"

    id = Column(Integer, index=True, primary_key=True)

    name = Column(String, nullable=False)
    host = Column(String, nullable=False)
    port = Column(Integer, nullable=False)
    default_generative_config = Column(String, nullable=True)
    display_name = Column(String, nullable=False)
    size = Column(String)
    gpu_usage = Column(String)
    max_tokens = Column(Integer)
    description = Column(String)
    project_url = Column(String)

    api_key_id = Column(Integer, ForeignKey("api_key.id"), nullable=True)
    api_key = relationship("ApiKey", uselist=False, foreign_keys="LmService.api_key_id")

    lm_service_prompt_block_associations = relationship(
        "LmServicePromptBlock", uselist=True, back_populates="lm_service", passive_deletes=True
    )
    prompt_blocks = association_proxy("lm_service_prompt_block_associations", attr="prompt_block")

    is_hosted = Column(Boolean, nullable=False)
    is_maintained = Column(Boolean, nullable=False)


@listens_for(LmService.__table__, "after_create")
def pre_populate_lm_service(target, connection, **kw):
    pre_populate_from_tsv(
        settings.db.initial_data_dir / "lm_service.tsv",
        target,
        connection,
        map_value_types={
            "is_hosted": lambda x: bool(int(x)),
            "is_maintained": lambda x: bool(int(x)),
        },
    )
