import requests
import logging

from config import header, assistant_dists_endpoint

logging.basicConfig(encoding='utf-8', level=logging.DEBUG)


def test_get_all_distributions():
    response = requests.get(assistant_dists_endpoint)
    assert response.status_code == 200, response.json()
