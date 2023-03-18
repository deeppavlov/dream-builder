import logging
from pathlib import Path
from typing import Union, Dict, Type, Callable

from sqlalchemy import Boolean, Column, Integer, String, ForeignKey
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.event import listens_for
from sqlalchemy.ext.compiler import compiles
from sqlalchemy.orm import relationship, backref
from sqlalchemy.sql import expression
from sqlalchemy.types import DateTime

from database import utils
from database.core import Base


class DateTimeUtcNow(expression.FunctionElement):
    type = DateTime()
    inherit_cache = True


@compiles(DateTimeUtcNow, "postgresql")
def pg_utcnow(element, compiler, **kwargs):
    return "TIMEZONE('utc', CURRENT_TIMESTAMP)"


# https://stackoverflow.com/a/46016930
# how do we set up roles?


class Role(Base):
    __tablename__ = "role"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)

    can_confirm_publish = Column(Boolean, nullable=False)
    can_set_roles = Column(Boolean, nullable=False)


class GoogleUser(Base):
    __tablename__ = "google_user"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String)
    sub = Column(String, unique=True)
    picture = Column(String(500), nullable=True)
    fullname = Column(String(100), nullable=True)
    given_name = Column(String(50), nullable=True)
    family_name = Column(String(50), nullable=True)
    role_id = Column(Integer, ForeignKey("role.id"), nullable=False)
    role = relationship("Role")

    virtual_assistants = relationship("VirtualAssistant", back_populates="author")
    dialog_sessions = relationship("DialogSessions", back_populates="user")


class UserValid(Base):
    __tablename__ = "user_valid"

    id = Column(Integer, index=True, primary_key=True)
    user_id = Column(Integer, ForeignKey("google_user.id"))
    refresh_token = Column(String, unique=True)
    is_valid = Column(Boolean, nullable=False)
    expire_date = Column(DateTime, nullable=False)


class ApiToken(Base):
    __tablename__ = "api_token"

    id = Column(Integer, index=True, primary_key=True)
    name = Column(String)
    description = Column(String)
    base_url = Column(String)


class UserApiToken(Base):
    __tablename__ = "user_api_token"

    id = Column(Integer, index=True, primary_key=True)

    user_id = Column(Integer, ForeignKey("google_user.id"), nullable=False)
    user = relationship("GoogleUser")

    api_token_id = Column(Integer, ForeignKey("api_token.id"), unique=True, nullable=False)
    api_token = relationship("ApiToken")

    token_value = Column(String)


class VirtualAssistant(Base):
    __tablename__ = "virtual_assistant"

    id = Column(Integer, index=True, primary_key=True)

    cloned_from_id = Column(Integer, ForeignKey("virtual_assistant.id"))
    clones = relationship("VirtualAssistant", backref=backref("cloned_from", remote_side=[id]))

    author_id = Column(Integer, ForeignKey("google_user.id"), nullable=False)
    author = relationship(GoogleUser, back_populates="virtual_assistants")

    source = Column(String, nullable=False)
    name = Column(String, unique=True, nullable=False)
    display_name = Column(String, nullable=False)
    description = Column(String, nullable=False)
    date_created = Column(DateTime, nullable=False, server_default=DateTimeUtcNow())

    publish_request = relationship("PublishRequest", uselist=False, back_populates="virtual_assistant")
    deployment = relationship("Deployment", uselist=False, back_populates="virtual_assistant")


class Deployment(Base):
    __tablename__ = "deployment"

    id = Column(Integer, index=True, primary_key=True)

    virtual_assistant_id = Column(Integer, ForeignKey("virtual_assistant.id"), nullable=False, unique=True)
    virtual_assistant = relationship("VirtualAssistant", uselist=False)

    chat_url = Column(String, nullable=False)
    prompt = Column(String)
    lm_service = Column(String)


class PublishRequest(Base):
    __tablename__ = "publish_request"

    id = Column(Integer, index=True, primary_key=True)
    slug = Column(String, unique=True)
    date_created = Column(DateTime, nullable=False, server_default=DateTimeUtcNow())

    virtual_assistant_id = Column(Integer, ForeignKey("virtual_assistant.id"), nullable=False)
    virtual_assistant = relationship("VirtualAssistant")

    user_id = Column(Integer, ForeignKey("google_user.id"))
    user = relationship("GoogleUser", uselist=False, foreign_keys="PublishRequest.user_id")

    is_confirmed = Column(Boolean)
    confirmed_by_user_id = Column(Integer, ForeignKey("google_user.id"))
    confirmed_by_user = relationship("GoogleUser", uselist=False, foreign_keys="PublishRequest.confirmed_by_user_id")


class Component(Base):
    __tablename__ = "component"

    id = Column(Integer, index=True, primary_key=True)
    group = Column(String, nullable=False)
    source = Column(String, nullable=False)
    container = Column(String, nullable=False)
    endpoint = Column(String, nullable=False)


class VirtualAssistantComponent(Base):
    __tablename__ = "virtual_assistant_component"

    id = Column(Integer, index=True, primary_key=True)
    virtual_assistant_id = Column(Integer, ForeignKey("virtual_assistant.id"), nullable=False)
    virtual_assistant = relationship("VirtualAssistant")
    component_id = Column(Integer, ForeignKey("component.id"), nullable=False)
    component = relationship("Component")
    is_enabled = Column(Boolean, nullable=False)


class DialogSession(Base):
    __tablename__ = "dialog_session"

    id = Column(Integer, index=True, primary_key=True)

    user_id = Column(Integer, ForeignKey("google_user.id"))
    user = relationship("GoogleUser", uselist=False, foreign_keys="DialogSession.user_id")

    deployment_id = Column(Integer, ForeignKey("deployment.id"), nullable=False)
    deployment = relationship("Deployment", uselist=False, foreign_keys="DialogSession.deployment_id")

    is_active = True


def _pre_populate_from_tsv(
    path: Union[Path, str],
    target,
    connection,
    map_value_types: Dict[str, Type[bool | int | Callable[[str], bool | int]]] = None,
):
    logging.error(f"Pre-populating {target.name} from {path}")

    for row in utils.iter_tsv_rows(path, map_value_types):
        connection.execute(target.insert(), row)


@listens_for(Role.__table__, "after_create")
def pre_populate_role(target, connection, **kw):
    _pre_populate_from_tsv(
        "database/initial_data/role.tsv",
        target,
        connection,
        map_value_types={"can_confirm_publish": lambda x: bool(int(x)), "can_set_roles": lambda x: bool(int(x))},
    )


@listens_for(GoogleUser.__table__, "after_create")
def pre_populate_google_user(target, connection, **kw):
    _pre_populate_from_tsv("database/initial_data/google_user.tsv", target, connection)


@listens_for(ApiToken.__table__, "after_create")
def pre_populate_api_token(target, connection, **kw):
    _pre_populate_from_tsv("database/initial_data/api_token.tsv", target, connection)


@listens_for(VirtualAssistant.__table__, "after_create")
def pre_populate_virtual_assistant(target, connection, **kw):
    _pre_populate_from_tsv("database/initial_data/virtual_assistant.tsv", target, connection)


@listens_for(PublishRequest.__table__, "after_create")
def pre_populate_publish_request(target, connection, **kw):
    _pre_populate_from_tsv(
        "database/initial_data/publish_request.tsv",
        target,
        connection,
        map_value_types={"is_confirmed": lambda x: bool(int(x))},
    )


@listens_for(Deployment.__table__, "after_create")
def pre_populate_deployment(target, connection, **kw):
    _pre_populate_from_tsv("database/initial_data/deployment.tsv", target, connection)
