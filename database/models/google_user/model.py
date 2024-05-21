from apiconfig.config import settings
from database.core import Base
from database.utils import DateTimeUtcNow, pre_populate_from_tsv
from sqlalchemy import Column, ForeignKey, Integer, Sequence, String
from sqlalchemy.event import listens_for
from sqlalchemy.orm import relationship
from sqlalchemy.types import DateTime


class GoogleUser(Base):
    __tablename__ = "google_user"

    id = Column(
        Integer,
        Sequence("google_user_id_seq", start=3, increment=1),
        primary_key=True,
        index=True,
    )
    user_id = Column(Integer, ForeignKey("user.id", ondelete="CASCADE"), nullable=False)
    email = Column(String)
    sub = Column(String, unique=True)

    picture = Column(String(500), nullable=True)

    fullname = Column(String(100), nullable=True)
    given_name = Column(String(50), nullable=True)
    family_name = Column(String(50), nullable=True)

    date_created = Column(DateTime, nullable=False, server_default=DateTimeUtcNow())

    role_id = Column(Integer, ForeignKey("role.id"), nullable=False)
    role = relationship("Role")

    plan_id = Column(Integer, ForeignKey("plan.id"), nullable=False, default=1)
    plan = relationship("Plan")


@listens_for(GoogleUser.__table__, "after_create")
def pre_populate_google_user(target, connection, **kw):
    pre_populate_from_tsv(settings.db.initial_data_dir / "google_user.tsv", target, connection)
