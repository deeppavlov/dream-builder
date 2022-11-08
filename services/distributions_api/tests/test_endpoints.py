from fastapi.testclient import TestClient
from deeppavlov_dreamtools.distconfigs.manager import list_dists

from main import app
from const import DREAM_ROOT_PATH


client = TestClient(app)

def test_get_list_of_distributions():
    response = client.get("/api/assistant_dists/")
    assert response.status_code == 200
    assert len(response.json()) == len(list_dists(DREAM_ROOT_PATH))
