import requests

from config import header, token_endpoint


def test_auth_bad_token():
    bad_header = {"jwt-data": "abc.abc.abc", 'accept': 'application/json'}
    response = requests.get(token_endpoint, headers=bad_header)
    assert response.status_code == 400, response.json()


def test_auth_valid_token():
    response = requests.get(token_endpoint, headers=header)
    assert response.status_code == 200, response.json()
