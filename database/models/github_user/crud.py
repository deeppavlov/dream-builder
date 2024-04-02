from database.models.github_user.model import GithubUser
from sqlalchemy import String, cast, update
from sqlalchemy.orm import Session


def add_user(db: Session, user, user_id: int) -> GithubUser:
    """
    `user` should be of type services.auth_api.GithubUserCreate

    ```
    class GithubUserCreate(UserBase):
        email: Optional[EmailStr]
        github_id: str
        picture: str
        name: str
    ```

    """
    db_user = GithubUser(
        email=user.email,
        user_id=user_id,
        github_id=user.github_id,
        picture=user.picture,
        name=user.name,
        role_id=1,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_by_outer_id(db: Session, github_id: str) -> GithubUser:
    return db.query(GithubUser).filter(GithubUser.github_id == cast(github_id, String)).first()


def check_user_exists(db: Session, github_id: str) -> bool:
    if get_by_outer_id(db, github_id):
        return True
    return False


def update_by_id(db: Session, user_id: int, **kwargs) -> GithubUser:
    kwargs = {k: v for k, v in kwargs.items() if k in GithubUser.__table__.columns.keys()}

    user = db.scalar(update(GithubUser).filter_by(user_id=user_id).values(**kwargs).returning(GithubUser))

    if not user:
        raise ValueError(f"GithubUser with id={user_id} does not exist")

    db.commit()
    db.refresh(user)

    return user
