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


class LmServiceLanguage(Base):
    __tablename__ = "lm_service_language"

    id = Column(Integer, index=True, primary_key=True)

    lm_service_id = Column(Integer, ForeignKey("lm_service.id"), nullable=True)
    lm_service = relationship("LmService")

    language_id = Column(Integer, ForeignKey("language.id"), nullable=True)
    language = relationship("Language")


@listens_for(LmServiceLanguage.__table__, "after_create")
def pre_populate_lm_service(target, connection, **kw):
    pre_populate_from_tsv(settings.db.initial_data_dir / "lm_service_language.tsv", target, connection)
