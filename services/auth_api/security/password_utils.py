from security.security import pwd_context


def hash_password(password: str):
    return pwd_context.verify(password)


def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)
