import os

from dotenv import load_dotenv

load_dotenv(".env")
AUTH_URL = os.getenv("AUTH_URL")
DISTRIBUTIONS_URL = os.getenv("AUTH_URL")
OUTDATED_JWT = os.getenv("TEST_JWT")
TEST_TOKEN = os.getenv("TEST_TOKEN")

# ASSISTANT_DISTS_URL = DISTRIBUTIONS_URL + "/assistant_dists"

header = {"jwt-data": TEST_TOKEN}
