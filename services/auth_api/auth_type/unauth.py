import uuid
from datetime import datetime

import sqlalchemy.exc
from fastapi import HTTPException
from sqlalchemy.orm import Session

from database.models import user, unauth_uservalid, unauth_user
from services.auth_api.auth_type.base import BaseAuth
from services.auth_api.models import User, UserToken
from database.models.unauth_user.model import UnauthUser


class Unauth(BaseAuth):
    USER_MODEL = UnauthUser
    USERVALID_MODEL = unauth_uservalid.UnauthUserValid
    PROVIDER_NAME = "unauth"

    async def validate_token(self, db: Session, token: str) -> User:
        """
        In this type of authorization token is a session UUID
        """
        user_ = unauth_uservalid.crud.get_by_token(db, token)
        try:
            self._validate_existing(user_)
            self._validate_date(user_)
            self._validate_login(user_)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))

        return User.from_orm(user.crud.get_by_id(db, user_.user_id))

    def _validate_existing(self, user: USERVALID_MODEL):
        if not user:
            raise ValueError("The user couldn't be found in the database")

    def _validate_date(self, user: USERVALID_MODEL):
        if datetime.now() > user.expire_date:
            raise ValueError("The user record is outdated")

    def _validate_login(self, user_: USERVALID_MODEL):
        if not user_.is_valid:
            raise ValueError("User is logged out")

    async def login(self, db: Session, token: str) -> UserToken:
        try:
            uuid_ = str(uuid.uuid4())
            guser = user.crud.add_user(db, self.PROVIDER_NAME, str(uuid_))
            uuser = unauth_user.crud.add_user(db, uuid_, guser.id)
            unauth_uservalid.crud.add_user(db, guser.id, uuser.token)
        except sqlalchemy.exc.IntegrityError as e:
            db.rollback()
            raise e

        return UserToken(**User.from_orm(guser).__dict__, token=uuid_)

    async def logout(self, db: Session, token: str) -> None:
        print(unauth_uservalid.crud.set_token_invalid(db, token))

    exchange_authcode = login
