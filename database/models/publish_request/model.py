from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
)
from sqlalchemy.event import listens_for
from sqlalchemy.orm import relationship
from sqlalchemy.sql import sqltypes
from sqlalchemy.types import DateTime

from apiconfig.config import settings
from database import enums
from database.core import Base
from database.utils import DateTimeUtcNow, pre_populate_from_tsv


class PublishRequest(Base):
    __tablename__ = "publish_request"

    id = Column(Integer, index=True, primary_key=True)

    virtual_assistant_id = Column(
        Integer, ForeignKey("virtual_assistant.id", ondelete="CASCADE"), nullable=False, unique=True
    )
    virtual_assistant = relationship(
        "VirtualAssistant", uselist=False, foreign_keys="PublishRequest.virtual_assistant_id"
    )

    user_id = Column(Integer, ForeignKey("user.id", ondelete="CASCADE"))
    user = relationship("GeneralUser", uselist=False, foreign_keys="PublishRequest.user_id")

    slug = Column(String, nullable=False, unique=True)
    public_visibility = Column(sqltypes.Enum(enums.VirtualAssistantPublicVisibility), nullable=False)
    state = Column(
        sqltypes.Enum(enums.PublishRequestState),
        nullable=False,
        server_default=enums.PublishRequestState.IN_REVIEW.value,
    )
    date_created = Column(DateTime, nullable=False, server_default=DateTimeUtcNow())

    reviewed_by_user_id = Column(Integer, ForeignKey("user.id"))
    reviewed_by_user = relationship("GeneralUser", uselist=False, foreign_keys="PublishRequest.reviewed_by_user_id")

    date_reviewed = Column(DateTime, nullable=True)


@listens_for(PublishRequest.__table__, "after_create")
def pre_populate_publish_request(target, connection, **kw):
    pre_populate_from_tsv(settings.db.initial_data_dir / "publish_request.tsv", target, connection)
