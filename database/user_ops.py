from typing import Union

import sqlalchemy
from sqlalchemy.orm import Session

from database.models import GoogleUser, GithubUser
from database.models.user import crud as user_crud

provider_table_mapping = {
    "google": GoogleUser,
    "github": GithubUser,
}

list_of_admins: [Union[GoogleUser, GithubUser]] = None
list_of_admins_ids: {int} = None


def update_user_email(db: Session, user_id: int, provider_name: str, new_email: str, auth_type: str):
    """
    Update a user's email after verifying their role.
    """
    if provider_name not in provider_table_mapping:
        raise ValueError(f"Invalid provider_name {provider_name}")

    User = provider_table_mapping[provider_name]

    validate_user_id(db, user_id, auth_type) # role must be user

    user = user_crud.get_by_id(db, user_id)

    if not user:
        raise ValueError(f"User not found with the specified user_id {user_id}")

    provider_user = db.query(User).filter(User.user_id == user_id).first()

    if not provider_user:
        raise ValueError("User not found for the given auth provider")

    provider_user.email = new_email

    try:
        db.commit()
        db.refresh(provider_user)
    except sqlalchemy.exc as e:
        db.rollback()
        raise e

    return provider_user


def validate_user_id(db: Session, user_id: int, auth_type: str):
    """
    Validate a user's ID and prevent changes for admin users.
    """
    global list_of_admins, list_of_admins_ids
    if list_of_admins is None or list_of_admins_ids is None:
        list_of_admins = user_crud.get_by_role(db, 3, auth_type=auth_type)
        list_of_admins_ids = {admin.id for admin in list_of_admins}

    if user_id in list_of_admins_ids:
        raise ValueError("Can't change admin")
