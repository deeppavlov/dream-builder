import requests
import logging

from config import DISTRIBUTIONS_URL, header

logging.basicConfig(encoding='utf-8', level=logging.DEBUG)


def test_get_all_distributions():
    response = requests.get(DISTRIBUTIONS_URL, headers=header)
    assert response.status_code == 200, response.json()
