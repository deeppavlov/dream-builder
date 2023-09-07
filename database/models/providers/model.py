from apiconfig.config import settings
from database.core import Base
from database.utils import pre_populate_from_tsv
from sqlalchemy import Column, Integer, String
from sqlalchemy.event import listens_for


class Provider(Base):
    __tablename__ = "provider"

    id = Column(Integer, primary_key=True, index=True)
    service_name = Column(String, nullable=False)
    url = Column(String, nullable=False)


@listens_for(Provider.__table__, "after_create")
def pre_populate_provider(target, connection, **kw):
    pre_populate_from_tsv(settings.db.initial_data_dir / "provider.tsv", target, connection)
