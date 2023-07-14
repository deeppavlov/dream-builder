from apiconfig.config import settings
from database.core import Base
from database.utils import DateTimeUtcNow, pre_populate_from_tsv
from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.event import listens_for
from sqlalchemy.orm import relationship
from sqlalchemy.types import DateTime


class GithubUser(Base):
    __tablename__ = "github_user"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id", ondelete="CASCADE"), nullable=False)
    email = Column(String, nullable=True)
    github_id = Column(String, unique=True)
    picture = Column(String(500), nullable=True)
    name = Column(String(100), nullable=True)

    date_created = Column(DateTime, nullable=False, server_default=DateTimeUtcNow())

    role_id = Column(Integer, ForeignKey("role.id"), nullable=False)
    role = relationship("Role")


@listens_for(GithubUser.__table__, "after_create")
def pre_populate_google_user(target, connection, **kw):
    pre_populate_from_tsv(settings.db.initial_data_dir / "github_user.tsv", target, connection)
