from sqlalchemy import Column, Integer, String, DECIMAL
from sqlalchemy.event import listens_for
from sqlalchemy.types import DateTime

from apiconfig.config import settings
from database.core import Base
from database.utils import DateTimeUtcNow, pre_populate_from_tsv


class Plan(Base):
    __tablename__ = "plan"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    max_active_assistants = Column(Integer, nullable=False)
    price = Column(Integer, nullable=False)

    date_created = Column(DateTime, nullable=False, server_default=DateTimeUtcNow())

@listens_for(Plan.__table__, "after_create")
def pre_populate_plan(target, connection, **kw):
    pre_populate_from_tsv(settings.db.initial_data_dir / "plan.tsv", target, connection)
