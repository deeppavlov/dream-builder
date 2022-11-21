from fastapi.testclient import TestClient
from sqlalchemy.engine import create_engine

from app import app
from db.db import db_url

client = TestClient(app)


def test_database_connection():
    engine = create_engine(db_url)
    assert engine


def test_simple_token():
    response = client.get("/auth/token")
    assert response.status_code == 400
