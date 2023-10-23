from sqlalchemy import (
    Boolean,
    Column,
    Integer,
    ForeignKey,
)
from sqlalchemy.event import listens_for
from sqlalchemy.orm import relationship

from apiconfig.config import settings
from database.core import Base
from database.utils import pre_populate_from_tsv


class LmServicePromptBlock(Base):
    __tablename__ = "lm_service_prompt_block"

    id = Column(Integer, index=True, primary_key=True)

    lm_service_id = Column(Integer, ForeignKey("lm_service.id", ondelete="CASCADE"), nullable=False)
    lm_service = relationship("LmService")

    prompt_block_id = Column(Integer, ForeignKey("prompt_block.id", ondelete="CASCADE"), nullable=False)
    prompt_block = relationship("PromptBlock")


@listens_for(LmServicePromptBlock.__table__, "after_create")
def pre_populate_lm_service_prompt_block(target, connection, **kw):
    pre_populate_from_tsv(settings.db.initial_data_dir / "lm_service_prompt_block.tsv", target, connection)
