from sqlalchemy.orm import Session

from database.models.unauth_user.model import UnauthUser


def add_user(db: Session, outer_id: str, user_id: int) -> UnauthUser:
    user = UnauthUser(
        token=outer_id,
        user_id=user_id,
        role_id=1
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

