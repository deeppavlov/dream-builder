from sqlalchemy import Boolean, Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship, backref

from database.core import Base


class GoogleUser(Base):
    __tablename__ = "google_user"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String)
    sub = Column(String, unique=True)
    picture = Column(String(500), nullable=True)
    fullname = Column(String(100), nullable=True)
    given_name = Column(String(50), nullable=True)
    family_name = Column(String(50), nullable=True)

    virtual_assistants = relationship("VirtualAssistant", back_populates="author")


class UserValid(Base):
    __tablename__ = "user_valid"

    id = Column(Integer, index=True, primary_key=True)
    user_id = Column(Integer, ForeignKey("google_user.id"))
    refresh_token = Column(String, unique=True)
    is_valid = Column(Boolean, nullable=False)
    expire_date = Column(DateTime, nullable=False)


class VirtualAssistant(Base):
    __tablename__ = "virtual_assistant"

    id = Column(Integer, index=True, primary_key=True)

    cloned_from_id = Column(Integer, ForeignKey("virtual_assistant.id"))
    clones = relationship("VirtualAssistant", backref=backref("cloned_from", remote_side=[id]))

    author_id = Column(Integer, ForeignKey("google_user.id"))
    author = relationship(GoogleUser, back_populates="virtual_assistants")

    name = Column(String, unique=True)
    display_name = Column(String)
    description = Column(String)
    date_created = Column(DateTime)

    publish_request = relationship("PublishRequest", uselist=False, back_populates="virtual_assistant")


class PublishRequest(Base):
    __tablename__ = "publish_request"

    id = Column(Integer, index=True, primary_key=True)
    link_id = Column(String, unique=True)

    virtual_assistant_id = Column(Integer, ForeignKey("virtual_assistant.id"))
    virtual_assistant = relationship("VirtualAssistant")

    user_id = Column(Integer, ForeignKey("google_user.id"))

    date_created = Column(DateTime)
    is_confirmed = Column(Boolean)
