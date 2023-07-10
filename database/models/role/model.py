from sqlalchemy import (
    Boolean,
    Column,
    Integer,
    String,
)
from sqlalchemy.event import listens_for

from apiconfig.config import settings
from database.core import Base
from database.utils import pre_populate_from_tsv


# https://stackoverflow.com/a/46016930
# how do we set up roles?
class Role(Base):
    __tablename__ = "role"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)

    can_view_private_assistants = Column(Boolean, nullable=False)
    can_confirm_publish = Column(Boolean, nullable=False)
    can_set_roles = Column(Boolean, nullable=False)


@listens_for(Role.__table__, "after_create")
def pre_populate_role(target, connection, **kw):
    pre_populate_from_tsv(
        settings.db.initial_data_dir / "role.tsv",
        target,
        connection,
        map_value_types={
            "can_view_private_assistants": lambda x: bool(int(x)),
            "can_confirm_publish": lambda x: bool(int(x)),
            "can_set_roles": lambda x: bool(int(x)),
        },
    )
