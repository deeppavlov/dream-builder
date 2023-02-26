import requests
from .config import (
    header_token,
    header_logout,
    header_update_token,
    token_endpoint,
    logout_endpoint,
    update_token_endpoint,
    params_update_token,
)


def test_auth_bad_token():
    bad_header = {"token": "abc.abc.abc", "accept": "application/json"}
    response = requests.get(token_endpoint, headers=bad_header)
    assert response.status_code == 400, response.json()


def test_auth_valid_token():
    response = requests.get(token_endpoint, headers=header_token)
    assert response.status_code == 200, response.json()


def test_auth_logout():
    response = requests.put(logout_endpoint, headers=header_logout)
    assert response.status_code == 204, response.json()


def test_auth_update_bad_token():
    response = requests.post(update_token_endpoint, params=params_update_token, headers=header_update_token)
    assert response.status_code == 401, response.json()
