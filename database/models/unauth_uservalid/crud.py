from datetime import datetime, timedelta

from sqlalchemy.orm import Session

from database.models.unauth_uservalid.model import UnauthUserValid


def add_user(db: Session, user_id: int, token: str) -> UnauthUserValid:
    user = UnauthUserValid(
        user_id=user_id,
        token=token,
        is_valid=True,
        expire_date=datetime.now() + timedelta(days=10)
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def get_by_token(db: Session, token: str) -> UnauthUserValid:
    return db.query(UnauthUserValid).where((UnauthUserValid.token == token)).first()


def set_token_invalid(db: Session, token: str):
    db.query(UnauthUserValid).filter(UnauthUserValid.token == token).update({"is_valid": False})
    db.commit()
