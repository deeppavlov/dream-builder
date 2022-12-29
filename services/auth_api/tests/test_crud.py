import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from services.auth_api.config import settings
from services.auth_api.db.db import init_db
from services.auth_api.db.db_models import UserValid
import services.auth_api.db.crud as crud
from services.auth_api.app import app as auth_app
from services.auth_api import models


client = TestClient(auth_app)
SessionLocal = init_db(settings.db.user, settings.db.password, settings.db.host, settings.db.port, settings.db.name)


@pytest.fixture
def db_session():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture
def user_test(db_session) -> models.UserCreate:
    user_create = models.UserCreate(
        email="test@yandex.ru", sub="test", picture="test", name="test", given_name="test", family_name="test"
    )
    crud.get_or_create_user(db_session, user_create)
    yield user_create


@pytest.fixture
def user_valid_test():
    user_valid = models.UserValidScheme(token=settings.auth.test_token, is_valid=False)
    yield user_valid


def test_get_or_create_user(db_session: Session, user_test: models.UserCreate):
    user = crud.get_or_create_user(db_session, user_test)
    assert user
    assert user.sub == "test"
    assert user.fullname == "test"


def test_get_user_by_email(db_session: Session, user_test: models.UserCreate):
    user = crud.get_user_by_email(db_session, user_test.email)

    assert user
    assert user.sub == "test"
    assert user.fullname == "test"


def test_add_user_to_uservalid(
    db_session: Session,
    user_valid_test: models.UserValidScheme
):
    test_email = "test@yandex.ru"
    crud.add_user_to_uservalid(db_session, user_valid_test, test_email)
    google_user = crud.get_user_by_email(db_session, test_email)
    user = db_session.query(UserValid).filter(UserValid.user_id == google_user.id).first()
    assert user


def test_set_users_token_invalid(db_session):
    crud.set_users_token_invalid(db_session, settings.auth.test_token)
    user = db_session.query(UserValid).filter(UserValid.token == settings.auth.test_token).first()
    assert not user.is_valid
