from sqlalchemy import (
    Column,
    Integer,
    String,
)
from sqlalchemy.event import listens_for
from sqlalchemy.orm import relationship
from sqlalchemy.types import DateTime

from apiconfig.config import settings
from database.core import Base
from database.utils import DateTimeUtcNow, pre_populate_from_tsv


class Service(Base):
    __tablename__ = "service"

    id = Column(Integer, index=True, primary_key=True)
    source = Column(String, nullable=False, unique=True)
    name = Column(String, nullable=False)

    date_created = Column(DateTime, nullable=False, server_default=DateTimeUtcNow())
    components = relationship("Component", back_populates="service", passive_deletes=True)
    # deployment = relationship("ServiceDeployment", uselist=False, back_populates="service", passive_deletes=True)

    # # https://docs.sqlalchemy.org/en/20/orm/extensions/mutable.html#establishing-mutability-on-scalar-column-values
    # # let's see if it works with JSONB instead of the JSONEncodedDict from the docs
    # build_args = Column(mutable.MutableDict.as_mutable(JSONB), nullable=True)
    # compose_override = Column(mutable.MutableDict.as_mutable(JSONB), nullable=True)
    # compose_dev = Column(mutable.MutableDict.as_mutable(JSONB), nullable=True)
    # compose_proxy = Column(mutable.MutableDict.as_mutable(JSONB), nullable=True)


@listens_for(Service.__table__, "after_create")
def pre_populate_service(target, connection, **kw):
    pre_populate_from_tsv(
        settings.db.initial_data_dir / "service.tsv",
        target,
        connection,
    )
