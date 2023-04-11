import requests
from qaseio.pytest import qase
from .config import (
    auth_endpoint,
    auth_token,
    auth_refresh_token,
    db_config,
    create_mocks_public_dist,
    clean_testdb,
    counter_auth as counter
)
import database.crud as crud
from database.core import init_db


class TestAuth:
    @classmethod
    def setup_class(self):
        db = init_db(*db_config)()
        create_mocks_public_dist(db=db)
        db.close()

    @classmethod
    def teardown_class(self):
        db = init_db(*db_config)()
        # clean_all_testdata(db, exist_email)
        clean_testdb(db=db)
        db.close()

    @qase.title(f"{counter()}. test_auth_bad_token")
    def test_auth_bad_token(self):
        response = requests.get(
            url=auth_endpoint + "token", headers={"token": "abc.abc.abc", "accept": "application/json"}
        )
        assert response.status_code == 400, response.json()

    @qase.title(f"{counter()}. test_auth_valid_token")
    def test_auth_valid_token(self):
        response = requests.get(
            url=auth_endpoint + "token",
            headers={"token": auth_token, "accept": "application/json"}
        )
        assert response.status_code == 200, response.json()

    @qase.title(f"{counter()}. test_auth_logout")
    def test_auth_logout(self):
        response = requests.put(
            url=auth_endpoint + "logout",
            headers={
                "accept": "*/*",
                "refresh-token": auth_refresh_token,
            },
        )
        assert response.status_code == 204, response.json()

    @qase.title(f"{counter()}. test_auth_update_bad_token")
    def test_auth_update_bad_token(self):
        response = requests.post(
            url=auth_endpoint + "update_token",
            headers={
                "accept": "application/json",
                "content-type": "application/x-www-form-urlencoded",
            },
            params={
                "refresh_token": auth_refresh_token,
            },
        )
        assert response.status_code == 401, response.json()
