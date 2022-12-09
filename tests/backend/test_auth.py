import requests

from config import AUTH_URL, OUTDATED_JWT, header


def test_auth_bad_token():
    header_outdated_jwt = {"jwt-data": OUTDATED_JWT, 'accept': 'application/json'}
    response = requests.get(AUTH_URL, headers=header_outdated_jwt)
    assert response.status_code == 400, response.json()

def test_auth_valid_token():
    response = requests.get(AUTH_URL, headers=header)
    assert response.status_code == 200, response.json()
