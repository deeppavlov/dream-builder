import abc
from sqlalchemy.orm import Session

from services.shared.user import User
from services.auth_api.models import UserToken


class BaseAuth(abc.ABC):
    @staticmethod
    async def validate_token(self, db: Session, token: str) -> UserToken:
        pass

    @staticmethod
    async def login(self, db: Session, token: str) -> User:
        pass

    @staticmethod
    async def logout(self, db: Session, token: str) -> None:
        pass


class OAuth(BaseAuth):
    async def exchange_authcode(self, db: Session, auth_code: str) -> UserToken:
        pass

    login = exchange_authcode


class OAuth2(OAuth):
    async def update_access_token(self, db: Session, refresh_token: str) -> UserToken:
        pass
