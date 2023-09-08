import sqlalchemy.exc
from sqlalchemy.orm import Session

from services.shared.user import User, RoleRead
from services.auth_api.models import UserToken
from services.auth_api.auth_type.base import BaseAuth
from database.models.basic_user import crud as basic_user_crud, BasicUser
from database.models.user import crud as user_crud
from database.models.user import GeneralUser


class BasicAuth(BaseAuth):
    """
    This type of authorization is used to facilitate testing in a stage environment.
    WARNING: Method User.from_orm won't work with the `basic_user`!!!
    """
    AUTH_NAME = "basic"

    async def validate_token(self, db: Session, token: str) -> UserToken:
        general_user = user_crud.get_general_user_by_outer_id(db, token, self.AUTH_NAME)
        basic_user = basic_user_crud.get_by_outer_id(db, token)

        if not general_user and not basic_user:
            raise ValueError("The user couldn't be found")

        return self._to_usertoken(general_user, basic_user)

    async def login(self, db: Session, token: str) -> UserToken:
        """
        token should look like `email:password`
        """
        email, password = self._parse_token(token)

        basic_user = basic_user_crud.get_by_outer_id(db, token)
        general_user = user_crud.get_general_user_by_outer_id(db, token, self.AUTH_NAME)

        if not basic_user or not general_user:
            if not general_user:
                general_user = user_crud.add_user(db, self.AUTH_NAME, token)
            if not basic_user:
                basic_user = basic_user_crud.add_user(db, email, token, general_user.id)

        return self._to_usertoken(general_user, basic_user)

    async def logout(self, db: Session, token: str) -> None:
        """
        UNSUPPORTED
        """
        pass

    @staticmethod
    def _parse_token(token: str) -> list[str]:
        splitted: list[str] = token.split(":")

        if len(splitted) != 2:
            raise ValueError("Can't parse token")

        return splitted
    @staticmethod
    def _to_usertoken(general_user: GeneralUser, basic_user: BasicUser) -> UserToken:
        """
        """
        email = basic_user.token.split(":")[0]
        return UserToken(
            id=general_user.id,
            email=email,
            outer_id=basic_user.token,
            name=email,
            role=basic_user.role,
            token=basic_user.token,
        )
