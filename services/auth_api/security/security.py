from passlib.context import CryptContext

from auth import config

SECRET_KEY = config["security"]["SECRET_KEY"]
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = config["security"]["ACCESS_TOKEN_EXPIRE_MIN"]

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
