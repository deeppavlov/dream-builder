from sqlalchemy import (
    Boolean,
    Column,
    Integer,
    String,
    ForeignKey,
)
from sqlalchemy.event import listens_for
from sqlalchemy.orm import relationship
from sqlalchemy.sql import sqltypes

from apiconfig.config import settings
from database import enums
from database.core import Base
from database.utils import pre_populate_from_tsv


class Language(Base):
    __tablename__ = "language"

    id = Column(Integer, index=True, primary_key=True)
    value = Column(String, unique=True, nullable=False)


@listens_for(Language.__table__, "after_create")
def pre_populate_lm_service(target, connection, **kw):
    pre_populate_from_tsv(settings.db.initial_data_dir / "language.tsv", target, connection)
