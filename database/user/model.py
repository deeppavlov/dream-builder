from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
)
from sqlalchemy.event import listens_for
from sqlalchemy.orm import relationship
from sqlalchemy.types import DateTime

from apiconfig.config import settings
from database.core import Base
from database.dialog_session.model import DialogSession
from database.role.model import Role
from database.utils import DateTimeUtcNow, pre_populate_from_tsv
from database.virtual_assistant.model import VirtualAssistant


class GoogleUser(Base):
    __tablename__ = "google_user"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String)
    sub = Column(String, unique=True)

    picture = Column(String(500), nullable=True)

    fullname = Column(String(100), nullable=True)
    given_name = Column(String(50), nullable=True)
    family_name = Column(String(50), nullable=True)

    date_created = Column(DateTime, nullable=False, server_default=DateTimeUtcNow())

    role_id = Column(Integer, ForeignKey("role.id"), nullable=False)
    role = relationship("Role")

    virtual_assistants = relationship("VirtualAssistant", back_populates="author", passive_deletes=True)
    components = relationship("Component", back_populates="author", passive_deletes=True)
    dialog_sessions = relationship("DialogSession", back_populates="user", passive_deletes=True)
    # api_tokens = relationship("UserApiToken", back_populates="user", passive_deletes=True)


@listens_for(GoogleUser.__table__, "after_create")
def pre_populate_google_user(target, connection, **kw):
    pre_populate_from_tsv(settings.db.initial_data_dir / "google_user.tsv", target, connection)
