import services.auth_api.db.crud as crud
import pytest
from services.auth_api.db.db import init_db
from types import NoneType
from .config import (
    db_config,
    exist_email,
    not_exist_email,
    refresh_token,
    google_user,
    uservalid_user,
    clean_testdata,
)


@pytest.fixture(scope="function")
def db():
    db = init_db(*db_config)()
    yield db
    db.close()


class TestDb:
    @classmethod
    def teardown_class(self):
        db = init_db(*db_config)()
        clean_testdata(db, exist_email)
        db.close()

    def test_add_google_user(self, db):
        crud.add_google_user(db=db, user=google_user)
        assert crud.check_user_exists(db=db, email=exist_email), "Error while add google_user"

    def test_add_user_to_uservalid(self, db):
        crud.add_user_to_uservalid(db=db, user=uservalid_user, email=exist_email)
        assert crud.check_user_exists(db=db, email=exist_email), "Error while add user to uservalid"

    def test_check_user_exists(self, db):
        assert crud.check_user_exists(db=db, email=exist_email), "Error, the user actually exist"

    def test_check_user_not_exists(self, db):
        assert not crud.check_user_exists(db=db, email=not_exist_email), "Error, the user actually does not exist"

    def test_get_user_by_email(self, db):
        user = crud.get_user_by_email(db=db, email=exist_email)
        assert user.email == exist_email, "Error while get user by email"

    def test_get_uservalid_by_refresh_token(self, db):
        uservalid = crud.get_uservalid_by_refresh_token(db=db, refresh_token=refresh_token)
        user = crud.get_user_by_email(db=db, email=exist_email)
        assert uservalid.user_id == user.id, "Error while get uservalid by refresh token"

    def test_set_users_refresh_token_invalid(self, db):
        crud.set_users_refresh_token_invalid(db=db, refresh_token=refresh_token)
        uservalid = crud.get_uservalid_by_refresh_token(db=db, refresh_token=refresh_token)
        assert type(uservalid) == NoneType, "Error while set users refresh token_invalid"
