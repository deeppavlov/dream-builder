from datetime import datetime, timedelta
from typing import Optional, List

from fastapi.logger import logger
from sqlalchemy import select, update, and_, delete, func
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.orm import Session

from database import models, enums
from apiconfig.config import settings
from database import models
from database.models import GoogleUser, UserValid, ApiKey


# GOOGLE
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


def update_user(db: Session, id: int, **kwargs) -> models.GoogleUser:
    kwargs = {k: v for k, v in kwargs.items() if k in models.GoogleUser.__table__.columns.keys()}

    user = db.scalar(update(models.GoogleUser).filter_by(id=id).values(**kwargs).returning(models.GoogleUser))
    if not user:
        raise ValueError(f"GoogleUser with id={id} does not exist")

    return user


# GOOGLE USER VALID
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
def get_all_api_keys(db: Session) -> [models.ApiKey]:
    return db.scalars(select(ApiKey)).all()


# def create_or_update_user_api_token(
#     db: Session, user_id: int, api_token_id: int, token_value: str
# ) -> models.UserApiToken:
#     user_api_token = db.scalar(
#         insert(models.UserApiToken)
#         .values(user_id=user_id, api_token_id=api_token_id, token_value=token_value)
#         .on_conflict_do_update(constraint="unique_user_api_token", set_=dict(token_value=token_value))
#         .returning(models.UserApiToken)
#     )
#
#     return user_api_token
#
#
# def get_user_api_token(db: Session, id: int):
#     return db.get(models.UserApiToken, id)
#
#
# def get_user_api_tokens(db: Session, user_id: int) -> [models.UserApiToken]:
#     return db.scalars(select(models.UserApiToken).filter_by(user_id=user_id)).all()
#
#
# def delete_user_api_token(db: Session, user_api_token_id: int):
#     db.execute(delete(models.UserApiToken).filter(models.UserApiToken.id == user_api_token_id))


# VIRTUAL ASSISTANT
def get_virtual_assistant(db: Session, id: int) -> Optional[models.VirtualAssistant]:
    return db.get(models.VirtualAssistant, id)


def get_virtual_assistant_by_name(db: Session, name: str) -> Optional[models.VirtualAssistant]:
    virtual_assistant = db.scalar(select(models.VirtualAssistant).filter_by(name=name))

    if not virtual_assistant:
        raise ValueError(f"Virtual assistant {name} does not exist")

    return virtual_assistant


def get_all_virtual_assistants(db: Session) -> [models.VirtualAssistant]:
    return db.scalars(select(models.VirtualAssistant)).all()


def get_all_public_templates_virtual_assistants(db: Session) -> [models.VirtualAssistant]:
    return db.scalars(
        select(models.VirtualAssistant).where(
            and_(
                models.VirtualAssistant.publish_request.has(
                    public_visibility=enums.VirtualAssistantPublicVisibility.PUBLIC_TEMPLATE
                ),
                models.VirtualAssistant.publish_request.has(state=enums.PublishRequestState.APPROVED),
            )
        )
    ).all()


def get_all_user_virtual_assistants(db: Session, user_id: int) -> [models.VirtualAssistant]:
    return db.scalars(select(models.VirtualAssistant).where(models.VirtualAssistant.author_id == user_id)).all()


def create_virtual_assistant(
    db: Session,
    author_id: int,
    source: str,
    name: str,
    display_name: str,
    description: str,
    components: List[models.Component],
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

    # if cloned_from_id:
    #     original_components = get_virtual_assistant_components(db, cloned_from_id)

    create_virtual_assistant_components(db, new_virtual_assistant.id, components)

    return new_virtual_assistant


def update_virtual_assistant_by_name(db: Session, name: str, **kwargs):
    return db.scalar(
        update(models.VirtualAssistant).where(models.VirtualAssistant.name == name).values(**kwargs).returning(models.VirtualAssistant)
    )


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


# SERVICE
def create_service(db: Session, name: str, source: str):
    service = db.scalar(
        insert(models.Service)
        .values(name=name, source=source)
        .on_conflict_do_nothing(index_elements=[models.Service.source])
        .returning(models.Service)
    )
    if not service:
        service = db.scalar(select(models.Service).filter_by(source=source))

    return service


# COMPONENT
def get_component(db: Session, component_id: int) -> Optional[models.Component]:
    return db.get(models.Component, component_id)


def get_all_components(db: Session) -> [models.Component]:
    return db.scalars(select(models.Component)).all()


def get_components_by_group_name(
    db: Session, group: str, component_type: str = None, author_id: int = None
) -> [models.Component]:
    filters = {"group": group}
    if component_type:
        filters["component_type"] = component_type
    if author_id:
        filters["author_id"] = author_id

    return db.scalars(select(models.Component).filter_by(**filters)).all()


def create_component(
    db: Session,
    service_id: int,
    source: str,
    name: str,
    display_name: str,
    component_type: str,
    is_customizable: bool,
    author_id: int,
    ram_usage: str,
    group: str,
    endpoint: str,
    model_type: Optional[str] = None,
    gpu_usage: Optional[str] = None,
    description: Optional[str] = None,
    prompt: Optional[str] = None,
    prompt_goals: Optional[str] = None,
    lm_service_id: Optional[int] = None,
    # build_args: Optional[dict] = None,
    # compose_override: Optional[dict] = None,
    # compose_dev: Optional[dict] = None,
    # compose_proxy: Optional[dict] = None,
) -> models.Component:
    component = db.scalar(
        insert(models.Component)
        .values(
            service_id=service_id,
            source=source,
            name=name,
            display_name=display_name,
            # container_name=container_name,
            component_type=component_type,
            model_type=model_type,
            is_customizable=is_customizable,
            author_id=author_id,
            description=description,
            ram_usage=ram_usage,
            gpu_usage=gpu_usage,
            # port=port,
            group=group,
            endpoint=endpoint,
            prompt=prompt,
            prompt_goals=prompt_goals,
            lm_service_id=lm_service_id,
            # build_args=build_args,
            # compose_override=compose_override,
            # compose_dev=compose_dev,
            # compose_proxy=compose_proxy,
        )
        .on_conflict_do_nothing(index_elements=[models.Component.source])
        .returning(models.Component)
    )
    if not component:
        component = db.scalar(select(models.Component).filter_by(source=source))

    return component


def update_component(db: Session, id: int, **kwargs) -> models.Component:
    values = {k: v for k, v in kwargs.items() if v is not None}

    return db.scalar(update(models.Component).filter_by(id=id).values(**values).returning(models.Component))


def delete_component(db: Session, id: int):
    db.execute(delete(models.Component).filter(models.Component.id == id))


def get_next_available_component_port(db: Session, range_min: int = 8000, range_max: int = 8199):
    last_used_component_port = db.scalar(
        select(func.max(models.Component.port)).where(models.Component.port.between(range_min, range_max))
    )
    return last_used_component_port + 1


# VIRTUAL ASSISTANT COMPONENT
def get_virtual_assistant_component(
    db: Session, virtual_assistant_component_id: int
) -> [models.VirtualAssistantComponent]:
    return db.get(models.VirtualAssistantComponent, virtual_assistant_component_id)


def get_virtual_assistant_component_by_component_name(
    db: Session, virtual_assistant_id: int, component_name: str
) -> models.VirtualAssistantComponent:
    va_component = db.scalar(
        select(models.VirtualAssistantComponent).filter(
            and_(
                models.VirtualAssistantComponent.virtual_assistant_id == virtual_assistant_id,
                models.VirtualAssistantComponent.component.has(name=component_name),
            )
        )
    )
    if not va_component:
        raise ValueError(f"Component with name={component_name} does not exist")

    return va_component


def get_virtual_assistant_components(db: Session, virtual_assistant_id: int) -> [models.VirtualAssistantComponent]:
    return db.scalars(
        select(models.VirtualAssistantComponent).filter_by(virtual_assistant_id=virtual_assistant_id)
    ).all()


def get_virtual_assistant_components_by_name(
    db: Session, virtual_assistant_name: str
) -> [models.VirtualAssistantComponent]:
    virtual_assistant = get_virtual_assistant_by_name(db, virtual_assistant_name)

    return db.scalars(
        select(models.VirtualAssistantComponent).filter_by(virtual_assistant_id=virtual_assistant.id)
    ).all()


def get_virtual_assistant_components_with_component_name_like(
    db: Session, virtual_assistant_id: int, component_name_pattern: str
) -> [models.VirtualAssistantComponent]:
    return db.scalars(
        select(models.VirtualAssistantComponent).filter(
            and_(
                models.VirtualAssistantComponent.virtual_assistant_id == virtual_assistant_id,
                models.VirtualAssistantComponent.component.has(
                    models.Component.name.like(f"%{component_name_pattern}")
                ),
            )
        )
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


def create_virtual_assistant_components(db: Session, virtual_assistant_id: int, components: [models.Component]):
    new_virtual_assistant_components = []

    for component in components:
        new_component = create_virtual_assistant_component(db, virtual_assistant_id, component.id, True)
        new_virtual_assistant_components.append(new_component)

    return new_virtual_assistant_components


def delete_virtual_assistant_component(db: Session, id: int):
    db.execute(delete(models.VirtualAssistantComponent).filter(models.VirtualAssistantComponent.id == id))


# PUBLISH REQUEST
def get_all_publish_requests(db: Session):
    return db.scalars(select(models.PublishRequest)).all()


def get_unreviewed_publish_requests(db: Session):
    return db.scalars(
        select(models.PublishRequest).filter(models.PublishRequest.state == enums.PublishRequestState.IN_REVIEW)
    ).all()


def approve_publish_request(db: Session, id: int, reviewed_by_user_id: int) -> models.PublishRequest:
    return db.scalar(
        update(models.PublishRequest)
        .filter(models.PublishRequest.id == id)
        .values(
            state=enums.PublishRequestState.APPROVED,
            reviewed_by_user_id=reviewed_by_user_id,
            date_reviewed=datetime.utcnow(),
        )
        .returning(models.PublishRequest)
    )


def reject_publish_request(db: Session, id: int, reviewed_by_user_id: int) -> models.PublishRequest:
    return db.scalar(
        update(models.PublishRequest)
        .filter(models.PublishRequest.id == id)
        .values(
            state=enums.PublishRequestState.REJECTED,
            reviewed_by_user_id=reviewed_by_user_id,
            date_reviewed=datetime.utcnow(),
        )
        .returning(models.PublishRequest)
    )


def create_publish_request(
    db: Session,
    virtual_assistant_id: int,
    user_id: int,
    slug: str,
    public_visibility: enums.VirtualAssistantPublicVisibility,
):
    return db.scalar(
        insert(models.PublishRequest)
        .values(
            virtual_assistant_id=virtual_assistant_id, user_id=user_id, slug=slug, public_visibility=public_visibility
        )
        .on_conflict_do_update(
            index_elements=[models.PublishRequest.slug],
            set_=dict(
                public_visibility=public_visibility,
                date_created=datetime.utcnow(),
                state=enums.PublishRequestState.IN_REVIEW,
                reviewed_by_user_id=None,
                date_reviewed=None,
            ),
        )
        .returning(models.PublishRequest)
    )


def create_publish_request_autoconfirm(db: Session, virtual_assistant_id: int, user_id: int, slug: str):
    return db.scalar(
        insert(models.PublishRequest)
        .values(
            virtual_assistant_id=virtual_assistant_id,
            user_id=user_id,
            slug=slug,
            visibility="unlisted",
            is_confirmed=True,
            reviewed_by_user_id=1,
            date_reviewed=datetime.utcnow(),
        )
        .on_conflict_do_update(
            index_elements=[models.PublishRequest.slug],
            set_=dict(
                visibility="unlisted",
                date_created=datetime.utcnow(),
                is_confirmed=True,
                reviewed_by_user_id=1,
                date_reviewed=datetime.utcnow(),
            ),
        )
        .returning(models.PublishRequest)
    )


def delete_publish_request(db: Session, virtual_assistant_id: int):
    db.execute(delete(models.PublishRequest).filter_by(virtual_assistant_id=virtual_assistant_id))


# DIALOG SESSION
def get_dialog_session(db: Session, dialog_session_id: int):
    dialog_session = db.get(models.DialogSession, dialog_session_id)
    if not dialog_session:
        raise ValueError(f"Dialog session {dialog_session_id} does not exist")

    return dialog_session


def get_debug_assistant_chat_url(db: Session) -> str:
    debug_assistant = get_virtual_assistant_by_name(db, "universal_prompted_assistant")

    return f"{debug_assistant.deployment.chat_host}:{debug_assistant.deployment.chat_port}"


def create_dialog_session_by_name(db: Session, user_id: int, virtual_assistant_name: str) -> models.DialogSession:
    virtual_assistant = get_virtual_assistant_by_name(db, virtual_assistant_name)

    invalidated_sessions = db.scalars(
        update(models.DialogSession)
        .where(
            and_(
                models.DialogSession.user_id == user_id,
                models.DialogSession.deployment_id == virtual_assistant.deployment.id,
            )
        )
        .values(is_active=False)
        .returning(models.DialogSession)
    ).all()
    logger.info(f"Invalidated sessions: {', '.join(str(s.id) for s in invalidated_sessions)}")

    dialog_session = db.scalar(
        insert(models.DialogSession)
        .values(user_id=user_id, deployment_id=virtual_assistant.deployment.id, is_active=True)
        .returning(models.DialogSession)
    )

    return dialog_session


def update_dialog_session(db: Session, dialog_session_id: int, agent_dialog_id: str) -> models.DialogSession:
    dialog_session = db.scalar(
        update(models.DialogSession)
        .where(models.DialogSession.id == dialog_session_id)
        .values(agent_dialog_id=agent_dialog_id)
        .returning(models.DialogSession)
    )

    return dialog_session


# LM SERVICE
def get_all_lm_services(db: Session, hosted_only: bool = True) -> [models.LmService]:
    filter_kwargs = {}
    if hosted_only:
        filter_kwargs["is_hosted"] = True

    return db.scalars(select(models.LmService).filter_by(**filter_kwargs)).all()


def get_lm_service(db: Session, id: int) -> Optional[models.LmService]:
    return db.get(models.LmService, id)


def get_lm_service_by_name(db: Session, name: str) -> Optional[models.LmService]:
    return db.scalar(select(models.LmService).filter_by(name=name))


# DEPLOYMENT
def get_available_deployment_port(db: Session, range_min: int = 4550, range_max: int = 4999, exclude: list = None):
    used_ports = db.scalars(
        select(models.Deployment.chat_port).filter(models.Deployment.chat_port.between(range_min, range_max))
    ).all()
    if exclude:
        used_ports += exclude

    first_available_port = None

    for port in range(range_min, range_max + 1):
        if port not in used_ports:
            first_available_port = port
            break

    if first_available_port is None:
        raise ValueError(f"All ports in range [{range_min}, {range_max}] are exhausted.")

    return first_available_port


def get_deployment(db: Session, id: int):
    deployment = db.get(models.Deployment, id)

    if not deployment:
        raise ValueError(f"No deployments with id = {id}")

    return deployment


def get_all_deployments(db: Session, state: str = None) -> [models.Deployment]:
    select_stmt = select(models.Deployment)
    if state:
        select_stmt.filter_by(state=state)

    return db.scalars(select_stmt).all()


def get_deployment_by_virtual_assistant_name(db: Session, name: str) -> models.Deployment:
    virtual_assistant = get_virtual_assistant_by_name(db, name)

    try:
        deployment = db.scalar(select(models.Deployment).filter_by(virtual_assistant_id=virtual_assistant.id))
    except AttributeError:
        raise ValueError(f"No deployments for virtual_assistant.name = {name}")

    return deployment


def create_deployment(
    db: Session,
    virtual_assistant_id: int,
    chat_host: str,
    chat_port: int = None,
) -> models.Deployment:
    deployment = db.scalar(
        insert(models.Deployment)
        .values(
            virtual_assistant_id=virtual_assistant_id,
            chat_host=chat_host,
            chat_port=chat_port,
            state="STARTED",
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
        original_deployment.chat_host,
        original_deployment.chat_port,
    )


def update_deployment(db: Session, id: int, **kwargs) -> models.Deployment:
    deployment = db.scalar(update(models.Deployment).filter_by(id=id).values(**kwargs).returning(models.Deployment))

    return deployment


def delete_deployment(db: Session, id: int, **kwargs):
    db.execute(delete(models.Deployment).filter_by(id=id))


# GITHUB


def add_github_user(db: Session, user) -> models.GithubUser:
    """
    `user` should be of type services.auth_api.models.GithubUserCreate

    ```
    class GithubUserCreate(UserBase):
        email: Optional[EmailStr]
        github_id: str
        picture: str
        name: str
    ```

    """
    db_user = models.GithubUser(
        email=user.email,
        github_id=user.github_id,
        picture=user.picture,
        name=user.name,
        role_id=1,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_github_user_by_github_id(db: Session, github_id: str) -> models.GithubUser:
    return db.query(models.GithubUser).filter(models.GithubUser.github_id == github_id).first()


def get_github_uservalid_by_access_token(db: Session, access_token: str) -> models.GithubUserValid:
    return (
        db.query(models.GithubUserValid)
        .filter(models.GithubUserValid.access_token == access_token, models.GithubUserValid.is_valid == True)
        .first()
    )


def add_github_uservalid(db: Session, github_id: str, access_token: str) -> models.GithubUserValid:
    """
    `uservalid` should be of type services.auth_api.models.GithubUserValidScheme
    ```
    class GithubUserValidScheme(UserBase):
        access_token: str
        is_valid: bool
        expire_date: datetime
    ```
    """
    github_user = get_github_user_by_github_id(db, github_id)
    expire_date = datetime.now() + timedelta(days=settings.auth.refresh_token_lifetime_days)
    user_valid = models.GithubUserValid(
        user_id=github_user.id,
        access_token=access_token,
        is_valid=True,
        expire_date=expire_date,
    )
    db.add(user_valid)
    db.commit()
    db.refresh(user_valid)
    return user_valid


def set_github_users_access_token_invalid(db: Session, access_token: str) -> None:
    db.query(models.GithubUserValid).\
        filter(models.GithubUserValid.access_token == access_token).\
        update({"is_valid": False})
    db.commit()
