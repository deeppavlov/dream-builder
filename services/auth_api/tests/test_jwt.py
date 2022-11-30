import os
from fastapi.testclient import TestClient
from sqlalchemy.engine import create_engine
from dotenv import load_dotenv

from app import app
from db.db import db_url

client = TestClient(app)
load_dotenv()
test_jwt = os.getenv("TEST_JWT")


def test_database_connection():
    engine = create_engine(db_url)
    assert engine


def test_simple_token():
    response = client.get("/auth/token", headers={"jwt-data": test_jwt})
    assert response.status_code == 400
