from datetime import datetime, timedelta

from apiconfig.config import settings
from database.models.github_uservalid.model import GithubUserValid
from sqlalchemy.orm import Session


def get_by_access_token(db: Session, access_token: str) -> GithubUserValid:
    return (
        db.query(GithubUserValid)
        .filter(GithubUserValid.access_token == access_token, GithubUserValid.is_valid == True)
        .first()
    )


def add_user(db: Session, user_id: int, access_token: str) -> GithubUserValid:
    """
    `google_uservalid` should be of type services.auth_api.GithubUserValidScheme
    ```
    class GithubUserValidScheme(UserBase):
        access_token: str
        is_valid: bool
        expire_date: datetime
    ```
    """
    expire_date = datetime.now() + timedelta(days=settings.auth.refresh_token_lifetime_days)
    user_valid = GithubUserValid(
        user_id=user_id,
        access_token=access_token,
        is_valid=True,
        expire_date=expire_date,
    )
    db.add(user_valid)
    db.commit()
    db.refresh(user_valid)
    return user_valid


def set_token_invalid(db: Session, access_token: str) -> None:
    db.query(GithubUserValid).filter(GithubUserValid.access_token == access_token).update({"is_valid": False})
    db.commit()
