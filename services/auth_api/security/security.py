from passlib.context import CryptContext

from config import config

SECRET_KEY = config["security"]["SECRET_KEY"]
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(config["security"]["ACCESS_TOKEN_EXPIRE_MIN"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
