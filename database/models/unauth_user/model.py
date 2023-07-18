from sqlalchemy.dialects.postgresql import UUID

from database.core import Base
from database.utils import DateTimeUtcNow
from sqlalchemy import Column, ForeignKey, Integer, text
from sqlalchemy.orm import relationship
from sqlalchemy.types import DateTime


class UnauthUser(Base):
    """

    """
    __tablename__ = "unauth_user"

    id = Column(Integer, index=True, primary_key=True)
    token = Column(UUID(as_uuid=True))
    user_id = Column(Integer, ForeignKey("user.id", ondelete="CASCADE"), nullable=False)

    date_created = Column(DateTime, nullable=False, server_default=DateTimeUtcNow())

    role_id = Column(Integer, ForeignKey("role.id"), nullable=False)
    role = relationship("Role")


# @listens_for(UnauthUser.__table__, "after_create")
# def pre_populate_google_user(target, connection, **kw):
#     pre_populate_from_tsv(settings.db.initial_data_dir / "google_user.tsv", target, connection)
