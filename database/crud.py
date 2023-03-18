from sqlalchemy import select, update, and_
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.orm import Session
from typing import Optional

from database import models
from database.models import GoogleUser, UserValid, ApiToken, UserApiToken


def check_user_exists(db: Session, email) -> bool:
    if db.query(GoogleUser).filter(GoogleUser.email == email).first():
        return True
    return False


def add_google_user(db: Session, user) -> GoogleUser:
    db_user = GoogleUser(
        email=user.email,
        sub=user.sub,
        picture=user.picture,
        fullname=user.name,
        given_name=user.given_name,
        family_name=user.family_name,
        role_id=1,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_user_by_id(db: Session, user_id: int):
    return db.get(GoogleUser, user_id)


def get_user_by_sub(db: Session, sub: str):
    return db.scalar(select(GoogleUser).filter_by(sub=sub))


def get_user_by_email(db: Session, email: str) -> GoogleUser:
    return db.scalar(select(GoogleUser).filter_by(email=email))


def add_user_to_uservalid(db: Session, user, email: str) -> Optional[UserValid]:
    db_user = UserValid(**user.dict(), user_id=get_user_by_email(db, email).id)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def set_users_refresh_token_invalid(db: Session, refresh_token: str) -> None:
    db.query(UserValid).filter(UserValid.refresh_token == refresh_token).update({"is_valid": False})
    db.commit()


def get_uservalid_by_email(db: Session, email: str) -> Optional[UserValid]:
    user = get_user_by_email(db, email)
    if not user:
        return None
    user_id = user.id
    return db.query(UserValid).filter(UserValid.user_id == user_id, UserValid.is_valid == True).first()


def get_uservalid_by_refresh_token(db: Session, refresh_token: str) -> UserValid:
    return db.query(UserValid).filter(UserValid.refresh_token == refresh_token, UserValid.is_valid == True).first()


def check_uservalid_exists(db: Session, email) -> bool:
    user = get_user_by_email(db, email)
    if user and db.query(UserValid).filter(UserValid.id == user.id).first():
        return True
    return False


def update_users_refresh_token(db: Session, user, email: str):
    user_id = get_user_by_email(db, email).id
    db.query(UserValid).filter(UserValid.id == user_id).update(
        {"refresh_token": user.refresh_token, "expire_date": user.expire_date}
    )
    db.commit()


def get_all_users(db: Session):
    return db.scalars(select(GoogleUser)).all()


def get_all_api_tokens(db: Session):
    return db.scalars(select(ApiToken)).all()


def create_or_update_user_api_token(
    db: Session, user_id: int, api_token_id: int, token_value: str
) -> models.UserApiToken:
    user_api_token = db.scalar(
        insert(UserApiToken)
        .values(user_id=user_id, api_token_id=api_token_id, token_value=token_value)
        .on_conflict_do_update(index_elements=[UserApiToken.api_token_id], set_=dict(token_value=token_value))
        .returning(UserApiToken)
    )
    db.commit()

    return user_api_token


def get_dialog_session(db: Session, dialog_session_id: int):
    return db.get(models.DialogSession, dialog_session_id)


def create_dialog_session_by_name(db: Session, user_id: int, virtual_assistant_name: str):
    virtual_assistant = db.scalar(select(models.VirtualAssistant).filter_by(name=virtual_assistant_name))

    db.scalar(
        update(models.DialogSession)
        .where(
            and_(
                models.DialogSession.user_id == user_id,
                models.DialogSession.deployment_id == virtual_assistant.deployment.id,
            )
        )
        .values(is_active=False)
        .returning(models.DialogSession)
    )
    dialog_session = db.scalar(
        insert(models.DialogSession)
        .values(user_id=1, deployment_id=virtual_assistant.deployment.id, is_active=True)
        .returning(models.DialogSession)
    )
    db.commit()

    return dialog_session


def update_dialog_session(db: Session, dialog_session_id: int, agent_dialog_id: str):
    db.scalar(
        update(models.DialogSession)
        .where(models.DialogSession.id == dialog_session_id)
        .values(agent_dialog_id=agent_dialog_id)
        .returning(models.DialogSession)
    )
    db.commit()


def get_virtual_assistant_by_name(db: Session, name: str):
    return db.scalar(select(models.VirtualAssistant).filter_by(name=name))


def get_deployment_by_virtual_assistant_name(db: Session, name: str):
    virtual_assistant = get_virtual_assistant_by_name(db, name)
    return db.scalar(select(models.Deployment).filter_by(virtual_assistant_id=virtual_assistant.id))


def get_deployment_prompt_by_virtual_assistant_name(db: Session, name: str):
    deployment = get_deployment_by_virtual_assistant_name(db, name)

    return deployment.prompt


def update_deployment_by_virtual_assistant_name(db: Session, name: str, **kwargs):
    virtual_assistant = get_virtual_assistant_by_name(db, name)
    deployment = db.scalar(
        update(models.Deployment)
        .where(models.Deployment.virtual_assistant_id == virtual_assistant.id)
        .values(**kwargs)
        .returning(models.Deployment)
    )
    db.commit()

    return deployment


def set_deployment_prompt_by_virtual_assistant_name(db: Session, name: str, prompt: str) -> models.Deployment:
    deployment = update_deployment_by_virtual_assistant_name(db, name, prompt=prompt)

    return deployment


def get_deployment_lm_service_by_virtual_assistant_name(db: Session, name: str):
    deployment = get_deployment_by_virtual_assistant_name(db, name)

    return deployment.lm_service


def set_deployment_lm_service_by_virtual_assistant_name(
    db: Session, name: str, lm_service: str
) -> models.Deployment:
    deployment = update_deployment_by_virtual_assistant_name(db, name, lm_service=lm_service)

    return deployment
