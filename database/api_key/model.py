from sqlalchemy import (
    Column,
    Integer,
    String,
)
from sqlalchemy.event import listens_for

from apiconfig.config import settings
from database.core import Base
from database.utils import pre_populate_from_tsv


class ApiKey(Base):
    __tablename__ = "api_key"

    id = Column(Integer, index=True, primary_key=True)
    name = Column(String)
    display_name = Column(String)
    description = Column(String)
    base_url = Column(String)


@listens_for(ApiKey.__table__, "after_create")
def pre_populate_api_key(target, connection, **kw):
    pre_populate_from_tsv(settings.db.initial_data_dir / "api_key.tsv", target, connection)
