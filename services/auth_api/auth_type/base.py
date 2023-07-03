import abc
from sqlalchemy.orm import Session

from services.shared.user import UserToken


class BaseAuth(abc.ABC):
    async def validate_token(self, db: Session, token: str) -> UserToken:
        pass

    async def login(self, db: Session, token: str):
        pass

    async def logout(self, db: Session, token: str):
        pass


class OAuth(BaseAuth):
    async def exchange_authcode(self, db: Session, auth_code: str):
        pass

    login = exchange_authcode


class OAuth2(OAuth):
    async def update_access_token(self, db: Session, refresh_token: str):
        pass
