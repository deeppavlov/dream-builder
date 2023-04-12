from datetime import datetime

from sqlalchemy import select, update, and_, or_, delete, func
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.orm import Session
from typing import Optional, List

from database import models
from database.models import GoogleUser, UserValid, ApiToken, UserApiToken


# USER
def get_all_users(db: Session) -> [models.GoogleUser]:
    return db.scalars(select(GoogleUser)).all()


def check_user_exists(db: Session, email) -> bool:
    if db.query(GoogleUser).filter(GoogleUser.email == email).first():
        return True
    return False


def add_google_user(db: Session, user) -> models.GoogleUser:
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


def get_user(db: Session, user_id: int) -> Optional[models.GoogleUser]:
    return db.get(GoogleUser, user_id)


def get_user_by_sub(db: Session, sub: str) -> models.GoogleUser:
    return db.scalar(select(GoogleUser).filter_by(sub=sub))


def get_user_by_email(db: Session, email: str) -> models.GoogleUser:
    return db.scalar(select(GoogleUser).filter_by(email=email))


def get_users_by_role(db: Session, role_id: int) -> [models.GoogleUser]:
    return db.scalars(select(models.GoogleUser).filter_by(role_id=role_id)).all()


# USER VALID
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


# API TOKEN
def get_all_api_tokens(db: Session) -> [models.UserApiToken]:
    return db.scalars(select(ApiToken)).all()


def create_or_update_user_api_token(
    db: Session, user_id: int, api_token_id: int, token_value: str
) -> models.UserApiToken:
    user_api_token = db.scalar(
        insert(models.UserApiToken)
        .values(user_id=user_id, api_token_id=api_token_id, token_value=token_value)
        .on_conflict_do_update(constraint="unique_user_api_token", set_=dict(token_value=token_value))
        .returning(models.UserApiToken)
    )

    return user_api_token


def get_user_api_tokens(db: Session, user_id: int) -> [models.UserApiToken]:
    return db.scalars(select(models.UserApiToken).filter_by(user_id=user_id)).all()


# VIRTUAL ASSISTANT
def get_virtual_assistant(db: Session, id: int) -> Optional[models.VirtualAssistant]:
    return db.get(models.VirtualAssistant, id)


def get_all_virtual_assistants(db: Session) -> [models.VirtualAssistant]:
    return db.scalars(select(models.VirtualAssistant)).all()


def get_all_public_virtual_assistants(db: Session) -> [models.VirtualAssistant]:
    return db.scalars(
        select(models.VirtualAssistant).where(models.VirtualAssistant.publish_request.has(is_confirmed=True))
    ).all()


def get_all_private_virtual_assistants(db: Session, user_id: int) -> [models.VirtualAssistant]:
    return db.scalars(
        select(models.VirtualAssistant).where(
            and_(
                models.VirtualAssistant.author_id == user_id,
                ~models.VirtualAssistant.publish_request.has(is_confirmed=True),
            )
        )
    ).all()


def create_virtual_assistant(
    db: Session,
    author_id: int,
    source: str,
    name: str,
    display_name: str,
    description: str,
    cloned_from_id: Optional[int] = None,
) -> models.VirtualAssistant:
    new_virtual_assistant = db.scalar(
        insert(models.VirtualAssistant)
        .values(
            cloned_from_id=cloned_from_id,
            author_id=author_id,
            source=source,
            name=name,
            display_name=display_name,
            description=description,
        )
        .returning(models.VirtualAssistant)
    )

    if cloned_from_id:
        original_components = get_virtual_assistant_components(db, cloned_from_id)
        create_virtual_assistant_components(db, new_virtual_assistant.id, original_components)

    return new_virtual_assistant


def update_virtual_assistant_metadata_by_name(db: Session, name: str, **kwargs) -> models.VirtualAssistant:
    values = {k: v for k, v in kwargs.items() if v is not None}

    return db.scalar(
        update(models.VirtualAssistant)
        .where(models.VirtualAssistant.name == name)
        .values(**values)
        .returning(models.VirtualAssistant)
    )


def delete_virtual_assistant_by_name(db: Session, name: str) -> None:
    db.execute(delete(models.VirtualAssistant).where(models.VirtualAssistant.name == name))


def get_component(db: Session, component_id: int) -> Optional[models.Component]:
    return db.get(models.Component, component_id)


def get_all_components(db: Session) -> [models.Component]:
    return db.scalars(select(models.Component)).all()


def get_components_by_group_name(db: Session, group: str) -> [models.Component]:
    return db.scalars(select(models.Component).filter_by(group=group)).all()


def create_component(
    db: Session,
    source: str,
    name: str,
    display_name: str,
    container_name: str,
    component_type: str,
    is_customizable: bool,
    author_id: int,
    ram_usage: str,
    port: int,
    group: str,
    endpoint: str,
    model_type: Optional[str] = None,
    gpu_usage: Optional[str] = None,
    description: Optional[str] = None,
    build_args: Optional[dict] = None,
    compose_override: Optional[dict] = None,
    compose_dev: Optional[dict] = None,
    compose_proxy: Optional[dict] = None,
) -> models.Component:
    return db.scalar(
        insert(models.Component)
        .values(
            source=source,
            name=name,
            display_name=display_name,
            container_name=container_name,
            component_type=component_type,
            model_type=model_type,
            is_customizable=is_customizable,
            author_id=author_id,
            description=description,
            ram_usage=ram_usage,
            gpu_usage=gpu_usage,
            port=port,
            group=group,
            endpoint=endpoint,
            build_args=build_args,
            compose_override=compose_override,
            compose_dev=compose_dev,
            compose_proxy=compose_proxy,
        )
        .returning(models.Component)
    )


def delete_component(db: Session, id: int):
    db.execute(delete(models.Component).filter(models.Component.id == id))


def get_next_available_component_port(db: Session, range_min: int = 8000, range_max: int = 8199):
    last_used_component_port = db.scalar(
        select(func.max(models.Component.port)).where(models.Component.port.between(range_min, range_max))
    )
    return last_used_component_port + 1


def get_virtual_assistant_components(db: Session, virtual_assistant_id: int) -> [models.VirtualAssistantComponent]:
    return db.scalars(
        select(models.VirtualAssistantComponent).filter_by(virtual_assistant_id=virtual_assistant_id)
    ).all()


def get_virtual_assistant_components_by_name(
    db: Session, virtual_assistant_name: str
) -> [models.VirtualAssistantComponent]:
    virtual_assistant = db.scalar(select(models.VirtualAssistant).filter_by(name=virtual_assistant_name))

    return db.scalars(
        select(models.VirtualAssistantComponent).filter_by(virtual_assistant_id=virtual_assistant.id)
    ).all()


def create_virtual_assistant_component(
    db: Session, virtual_assistant_id: int, component_id: int, is_enabled: bool = True
):
    return db.scalar(
        insert(models.VirtualAssistantComponent)
        .values(
            virtual_assistant_id=virtual_assistant_id,
            component_id=component_id,
            is_enabled=is_enabled,
        )
        .returning(models.VirtualAssistantComponent)
    )


def create_virtual_assistant_components(
    db: Session, virtual_assistant_id: int, components: [models.VirtualAssistantComponent]
):
    new_components = []

    for component in components:
        new_component = create_virtual_assistant_component(
            db, virtual_assistant_id, component.component_id, component.is_enabled
        )
        new_components.append(new_component)

    return new_components


def delete_virtual_assistant_component(db: Session, id: int):
    db.execute(delete(models.VirtualAssistantComponent).filter(models.VirtualAssistantComponent.id == id))


# PUBLISH REQUEST
def get_all_publish_requests(db: Session):
    return db.scalars(select(models.PublishRequest)).all()


def get_unconfirmed_publish_requests(db: Session):
    return db.scalars(
        select(models.PublishRequest).filter(
            models.PublishRequest.is_confirmed == None, models.PublishRequest.reviewed_by_user_id == None
        )
    ).all()


def confirm_publish_request(db: Session, id: int, reviewed_by_user_id: int) -> models.PublishRequest:
    return db.scalar(
        update(models.PublishRequest)
        .filter(models.PublishRequest.id == id)
        .values(is_confirmed=True, reviewed_by_user_id=reviewed_by_user_id, date_reviewed=datetime.utcnow())
        .returning(models.PublishRequest)
    )


def decline_publish_request(db: Session, id: int, reviewed_by_user_id: int) -> models.PublishRequest:
    return db.scalar(
        update(models.PublishRequest)
        .filter(models.PublishRequest.id == id)
        .values(is_confirmed=False, reviewed_by_user_id=reviewed_by_user_id, date_reviewed=datetime.utcnow())
        .returning(models.PublishRequest)
    )


def create_publish_request(db: Session, virtual_assistant_id: int, user_id: int, slug: str):
    return db.scalar(
        insert(models.PublishRequest)
        .values(virtual_assistant_id=virtual_assistant_id, user_id=user_id, slug=slug)
        .on_conflict_do_update(
            index_elements=[models.PublishRequest.slug],
            set_=dict(
                date_created=datetime.utcnow(),
                is_confirmed=None,
                reviewed_by_user_id=None,
                date_reviewed=None,
            ),
        )
        .returning(models.PublishRequest)
    )


def get_dialog_session(db: Session, dialog_session_id: int) -> Optional[models.DialogSession]:
    return db.get(models.DialogSession, dialog_session_id)


def get_debug_assistant_chat_url(db: Session) -> str:
    debug_assistant = get_virtual_assistant_by_name(db, "universal_prompted_assistant")

    return debug_assistant.deployment.chat_url


def create_dialog_session_by_name(db: Session, user_id: int, virtual_assistant_name: str) -> models.DialogSession:
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


def update_dialog_session(db: Session, dialog_session_id: int, agent_dialog_id: str) -> models.DialogSession:
    dialog_session = db.scalar(
        update(models.DialogSession)
        .where(models.DialogSession.id == dialog_session_id)
        .values(agent_dialog_id=agent_dialog_id)
        .returning(models.DialogSession)
    )
    db.commit()
    return dialog_session


def get_all_lm_services(db: Session) -> [models.LmService]:
    return db.scalars(select(models.LmService)).all()


def get_lm_service(db: Session, id: int) -> Optional[models.LmService]:
    return db.get(models.LmService, id)


def get_lm_service_by_name(db: Session, name: str) -> Optional[models.LmService]:
    return db.scalar(select(models.LmService).filter_by(name=name))


def get_virtual_assistant_by_name(db: Session, name: str) -> Optional[models.VirtualAssistant]:
    return db.scalar(select(models.VirtualAssistant).filter_by(name=name))


def get_deployment_by_virtual_assistant_name(db: Session, name: str) -> models.Deployment:
    virtual_assistant = get_virtual_assistant_by_name(db, name)

    try:
        deployment = db.scalar(select(models.Deployment).filter_by(virtual_assistant_id=virtual_assistant.id))
    except AttributeError:
        raise ValueError(f"No deployments for virtual_assistant.name = {name}")

    return deployment


def create_deployment(
    db: Session, virtual_assistant_id: int, chat_url: str, prompt: str = None, lm_service_id: int = None
) -> models.Deployment:
    deployment = db.scalar(
        insert(models.Deployment)
        .values(
            virtual_assistant_id=virtual_assistant_id,
            chat_url=chat_url,
            prompt=prompt,
            lm_service_id=lm_service_id,
        )
        .returning(models.Deployment)
    )

    return deployment


def create_deployment_from_copy(
    db: Session, original_virtual_assistant_id: int, new_virtual_assistant_id: int
) -> models.Deployment:
    original_deployment = db.scalar(
        select(models.Deployment).where(models.Deployment.virtual_assistant_id == original_virtual_assistant_id)
    )

    if not original_deployment:
        raise ValueError(f"No deployments for virtual assistant with id {original_virtual_assistant_id}")

    return create_deployment(
        db,
        new_virtual_assistant_id,
        original_deployment.chat_url,
        original_deployment.prompt,
        original_deployment.lm_service_id,
    )


def update_deployment_by_virtual_assistant_name(db: Session, name: str, **kwargs) -> models.Deployment:
    virtual_assistant = get_virtual_assistant_by_name(db, name)
    deployment = db.scalar(
        update(models.Deployment)
        .where(models.Deployment.virtual_assistant_id == virtual_assistant.id)
        .values(**kwargs)
        .returning(models.Deployment)
    )
    db.commit()

    return deployment


def get_deployment_prompt_by_virtual_assistant_name(db: Session, name: str) -> str:
    deployment = get_deployment_by_virtual_assistant_name(db, name)

    return deployment.prompt


def set_deployment_prompt_by_virtual_assistant_name(db: Session, name: str, prompt: str) -> models.Deployment:
    deployment = update_deployment_by_virtual_assistant_name(db, name, prompt=prompt)

    return deployment


def get_deployment_lm_service_by_virtual_assistant_name(db: Session, name: str) -> str:
    deployment = get_deployment_by_virtual_assistant_name(db, name)

    return deployment.lm_service


def set_deployment_lm_service_by_virtual_assistant_name(
    db: Session, name: str, lm_service_name: str
) -> models.Deployment:
    lm_service = get_lm_service_by_name(db, lm_service_name)
    deployment = update_deployment_by_virtual_assistant_name(db, name, lm_service_id=lm_service.id)

    return deployment
