from passlib.context import CryptContext

SECRET_KEY = "6dfc0cbfe20d9432f542fd7e371f76fc2b72be717131b0937c29b1da4acd6080"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
