from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
)
from sqlalchemy.event import listens_for

from apiconfig.config import settings
from database.core import Base
from database.utils import pre_populate_from_tsv


class PromptBlock(Base):
    __tablename__ = "prompt_block"

    id = Column(Integer, index=True, primary_key=True)
    category = Column(String)
    display_name = Column(String)
    template = Column(String)
    example = Column(String)
    description = Column(String)
    newline_before = Column(Boolean)
    newline_after = Column(Boolean)


@listens_for(PromptBlock.__table__, "after_create")
def pre_populate_prompt_block(target, connection, **kw):
    pre_populate_from_tsv(
        settings.db.initial_data_dir / "prompt_block.tsv",
        target,
        connection,
        map_value_types={
            "newline_before": lambda x: bool(int(x)),
            "newline_after": lambda x: bool(int(x)),
        },
    )
