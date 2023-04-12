import json
import logging
from pathlib import Path
from typing import Union, Dict, Type, Callable

from sqlalchemy import Boolean, Column, Integer, String, ForeignKey, JSON, TypeDecorator, VARCHAR, UniqueConstraint
from sqlalchemy.dialects.postgresql import insert, JSONB
from sqlalchemy.event import listens_for
from sqlalchemy.ext import mutable
from sqlalchemy.ext.compiler import compiles
from sqlalchemy.orm import relationship, backref
from sqlalchemy.sql import expression
from sqlalchemy.types import DateTime

from apiconfig.config import settings
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

    virtual_assistants = relationship("VirtualAssistant", back_populates="author", passive_deletes=True)
    components = relationship("Component", back_populates="author", passive_deletes=True)
    dialog_sessions = relationship("DialogSession", back_populates="user", passive_deletes=True)
    api_tokens = relationship("UserApiToken", back_populates="user", passive_deletes=True)


class UserValid(Base):
    __tablename__ = "user_valid"

    id = Column(Integer, index=True, primary_key=True)
    user_id = Column(Integer, ForeignKey("google_user.id", ondelete="CASCADE"))
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
    __table_args__ = (
        UniqueConstraint('user_id', 'api_token_id', name='unique_user_api_token'),
    )

    id = Column(Integer, index=True, primary_key=True)

    user_id = Column(Integer, ForeignKey("google_user.id", ondelete="CASCADE"), nullable=False)
    user = relationship("GoogleUser")

    api_token_id = Column(Integer, ForeignKey("api_token.id"), unique=True, nullable=False)
    api_token = relationship("ApiToken")

    token_value = Column(String)


class VirtualAssistant(Base):
    __tablename__ = "virtual_assistant"

    id = Column(Integer, index=True, primary_key=True)

    cloned_from_id = Column(Integer, ForeignKey("virtual_assistant.id"))
    clones = relationship("VirtualAssistant", backref=backref("cloned_from", remote_side=[id]))

    author_id = Column(Integer, ForeignKey("google_user.id", ondelete="CASCADE"), nullable=False)
    author = relationship(GoogleUser, back_populates="virtual_assistants")

    source = Column(String, nullable=False)
    name = Column(String, unique=True, nullable=False)
    display_name = Column(String, nullable=False)
    description = Column(String, nullable=False)
    date_created = Column(DateTime, nullable=False, server_default=DateTimeUtcNow())

    publish_request = relationship(
        "PublishRequest", uselist=False, back_populates="virtual_assistant", passive_deletes=True
    )
    deployment = relationship("Deployment", uselist=False, back_populates="virtual_assistant", passive_deletes=True)


class LmService(Base):
    __tablename__ = "lm_service"

    id = Column(Integer, index=True, primary_key=True)

    name = Column(String, nullable=False)
    display_name = Column(String, nullable=False)
    size = Column(String)
    gpu_usage = Column(String)
    max_tokens = Column(Integer)
    description = Column(String)
    project_url = Column(String)


class Deployment(Base):
    __tablename__ = "deployment"

    id = Column(Integer, index=True, primary_key=True)

    virtual_assistant_id = Column(Integer, ForeignKey("virtual_assistant.id", ondelete="CASCADE"), nullable=False, unique=True)
    virtual_assistant = relationship("VirtualAssistant", uselist=False, foreign_keys="Deployment.virtual_assistant_id")

    chat_url = Column(String, nullable=False)
    prompt = Column(String)
    lm_service_id = Column(Integer, ForeignKey("lm_service.id"))
    lm_service = relationship("LmService", uselist=False, foreign_keys="Deployment.lm_service_id")


class PublishRequest(Base):
    __tablename__ = "publish_request"

    id = Column(Integer, index=True, primary_key=True)

    virtual_assistant_id = Column(Integer, ForeignKey("virtual_assistant.id", ondelete="CASCADE"), nullable=False, unique=True)
    virtual_assistant = relationship(
        "VirtualAssistant", uselist=False, foreign_keys="PublishRequest.virtual_assistant_id"
    )

    user_id = Column(Integer, ForeignKey("google_user.id", ondelete="CASCADE"))
    user = relationship("GoogleUser", uselist=False, foreign_keys="PublishRequest.user_id")

    slug = Column(String, nullable=False, unique=True)
    date_created = Column(DateTime, nullable=False, server_default=DateTimeUtcNow())

    is_confirmed = Column(Boolean, nullable=True)

    reviewed_by_user_id = Column(Integer, ForeignKey("google_user.id"))
    reviewed_by_user = relationship("GoogleUser", uselist=False, foreign_keys="PublishRequest.reviewed_by_user_id")

    date_reviewed = Column(DateTime, nullable=True)


class Component(Base):
    __tablename__ = "component"

    id = Column(Integer, index=True, primary_key=True)
    source = Column(String, nullable=False)
    name = Column(String, nullable=False)
    display_name = Column(String, nullable=False)
    container_name = Column(String, nullable=False)
    component_type = Column(String, nullable=True)
    model_type = Column(String, nullable=True)
    is_customizable = Column(Boolean, nullable=False)

    author_id = Column(Integer, ForeignKey("google_user.id", ondelete="CASCADE"), nullable=False)
    author = relationship("GoogleUser", back_populates="components")

    description = Column(String, nullable=True)

    ram_usage = Column(String, nullable=False)
    gpu_usage = Column(String, nullable=True)

    port = Column(Integer, nullable=False)
    group = Column(String, nullable=False)
    endpoint = Column(String, nullable=False)

    # https://docs.sqlalchemy.org/en/20/orm/extensions/mutable.html#establishing-mutability-on-scalar-column-values
    # let's see if it works with JSONB instead of the JSONEncodedDict from the docs
    build_args = Column(mutable.MutableDict.as_mutable(JSONB), nullable=True)
    compose_override = Column(mutable.MutableDict.as_mutable(JSONB), nullable=True)
    compose_dev = Column(mutable.MutableDict.as_mutable(JSONB), nullable=True)
    compose_proxy = Column(mutable.MutableDict.as_mutable(JSONB), nullable=True)

    date_created = Column(DateTime, nullable=False, server_default=DateTimeUtcNow())


class VirtualAssistantComponent(Base):
    __tablename__ = "virtual_assistant_component"

    id = Column(Integer, index=True, primary_key=True)

    virtual_assistant_id = Column(Integer, ForeignKey("virtual_assistant.id", ondelete="CASCADE"), nullable=False)
    virtual_assistant = relationship("VirtualAssistant")

    component_id = Column(Integer, ForeignKey("component.id", ondelete="CASCADE"), nullable=False)
    component = relationship("Component")

    is_enabled = Column(Boolean, nullable=False)


class DialogSession(Base):
    __tablename__ = "dialog_session"

    id = Column(Integer, index=True, primary_key=True)

    user_id = Column(Integer, ForeignKey("google_user.id", ondelete="CASCADE"))
    user = relationship("GoogleUser", uselist=False, foreign_keys="DialogSession.user_id")

    deployment_id = Column(Integer, ForeignKey("deployment.id", ondelete="CASCADE"), nullable=False)
    deployment = relationship("Deployment", uselist=False, foreign_keys="DialogSession.deployment_id")

    agent_dialog_id = Column(String)

    is_active = Column(Boolean, nullable=False)


def _pre_populate_from_tsv(
    path: Union[Path, str],
    target,
    connection,
    map_value_types: Dict[str, Type[bool | int | Callable[[str], bool | int]]] = None,
):
    logging.warning(f"Pre-populating {target.name} from {path}")

    for row in utils.iter_tsv_rows(path, map_value_types):
        connection.execute(target.insert(), row)


@listens_for(Role.__table__, "after_create")
def pre_populate_role(target, connection, **kw):
    _pre_populate_from_tsv(
        settings.db.initial_data_dir / "role.tsv",
        target,
        connection,
        map_value_types={"can_confirm_publish": lambda x: bool(int(x)), "can_set_roles": lambda x: bool(int(x))},
    )


@listens_for(GoogleUser.__table__, "after_create")
def pre_populate_google_user(target, connection, **kw):
    _pre_populate_from_tsv(settings.db.initial_data_dir / "google_user.tsv", target, connection)


@listens_for(ApiToken.__table__, "after_create")
def pre_populate_api_token(target, connection, **kw):
    _pre_populate_from_tsv(settings.db.initial_data_dir / "api_token.tsv", target, connection)


@listens_for(VirtualAssistant.__table__, "after_create")
def pre_populate_virtual_assistant(target, connection, **kw):
    _pre_populate_from_tsv(settings.db.initial_data_dir / "virtual_assistant.tsv", target, connection)


@listens_for(PublishRequest.__table__, "after_create")
def pre_populate_publish_request(target, connection, **kw):
    _pre_populate_from_tsv(
        settings.db.initial_data_dir / "publish_request.tsv",
        target,
        connection,
        map_value_types={"is_confirmed": lambda x: bool(int(x))},
    )


@listens_for(LmService.__table__, "after_create")
def pre_populate_lm_service(target, connection, **kw):
    _pre_populate_from_tsv(settings.db.initial_data_dir / "lm_service.tsv", target, connection)


@listens_for(Deployment.__table__, "after_create")
def pre_populate_deployment(target, connection, **kw):
    _pre_populate_from_tsv(settings.db.initial_data_dir / "deployment.tsv", target, connection)


@listens_for(Component.__table__, "after_create")
def pre_populate_component(target, connection, **kw):
    _pre_populate_from_tsv(
        settings.db.initial_data_dir / "component.tsv",
        target,
        connection,
        map_value_types={"is_customizable": lambda x: bool(int(x)), "build_args": json.loads},
    )


@listens_for(VirtualAssistantComponent.__table__, "after_create")
def pre_populate_virtual_assistant_component(target, connection, **kw):
    _pre_populate_from_tsv(
        settings.db.initial_data_dir / "virtual_assistant_component.tsv",
        target,
        connection,
        map_value_types={"is_enabled": lambda x: bool(int(x))},
    )
