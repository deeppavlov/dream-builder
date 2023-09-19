import os

from apiconfig.config import settings
from database.core import Base
from database.utils import pre_populate_from_tsv
from sqlalchemy import Column, ForeignKey, Integer, Sequence, String, UniqueConstraint
from sqlalchemy.event import listens_for
from sqlalchemy.orm import relationship


class GeneralUser(Base):
    """
    outer_id is the identifier of the third-party auth provider.
        For Google, it's sub, for GitHub - it's id (`github_id`)
    """

    __tablename__ = "user"

    id = Column(
        Integer,
        Sequence("user_id_seq", start=3, increment=1),
        primary_key=True,
        index=True,
    )
    outer_id = Column(String)
    provider_id = Column(Integer, ForeignKey("provider.id"), nullable=False)

    google_user = relationship("GoogleUser", backref="user", uselist=False)
    github_user = relationship("GithubUser", backref="user", uselist=False)
    unauth_user = relationship("UnauthUser", backref="user", uselist=False)
    basic_user = relationship("BasicUser", backref="user", uselist=False)

    virtual_assistants = relationship("VirtualAssistant", back_populates="author", passive_deletes=True)
    components = relationship("Component", back_populates="author", passive_deletes=True)
    dialog_sessions = relationship("DialogSession", back_populates="user", passive_deletes=True)
    # api_tokens = relationship("UserApiToken", back_populates="user", passive_deletes=True)

    # This constraint stands for uniqueness of the two fields simultaneously. Outer_id can be repeated
    # but pair (outer_id & provider_id) cannot.
    __table_args__ = (UniqueConstraint("outer_id", "provider_id", name="outer_provider_uc"),)


@listens_for(GeneralUser.__table__, "after_create")
def pre_populate_google_user(target, connection, **kw):
    pre_populate_from_tsv(settings.db.initial_data_dir / "user.tsv", target, connection)
