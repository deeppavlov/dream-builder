from urllib.parse import urlparse

import requests
from deeppavlov_dreamtools import AssistantDist
from deeppavlov_dreamtools.deployer.portainer import SwarmClient
from fastapi import HTTPException
from requests import HTTPError
from sqlalchemy.orm import Session
from starlette import status

from apiconfig.config import settings
from database.models.deployment.crud import get_by_virtual_assistant_name, create, update_by_id, delete_by_id
from database.models.virtual_assistant import crud as virtual_assistant_crud
from deployment_queue import tasks
from git_storage.git_manager import GitManager
from services.distributions_api import schemas

swarm_client = SwarmClient(settings.deployer.portainer_url, settings.deployer.portainer_key)

dream_git = GitManager(
    settings.git.local_path,
    settings.git.username,
    settings.git.remote_access_token,
    settings.git.remote_source_url,
    settings.git.remote_source_branch,
    settings.git.remote_copy_url,
    # settings.git.remote_copy_branch,
    f"{settings.git.remote_copy_branch}-{settings.app.agent_user_id_prefix}",
)


def create_deployment(db: Session, new_deployment: schemas.DeploymentCreate) -> schemas.DeploymentRead:
    deployment = get_by_virtual_assistant_name(db, new_deployment.virtual_assistant_name)
    if deployment:
        raise HTTPException(status_code=status.HTTP_425_TOO_EARLY, detail="Deployment is already in progress!")

    virtual_assistant = virtual_assistant_crud.get_by_name(db, new_deployment.virtual_assistant_name)
    dream_dist = AssistantDist.from_dist(settings.db.dream_root_path / virtual_assistant.source)
    dream_dist.save(overwrite=True, generate_configs=True)
    dream_git.push_to_copy_remote_origin()

    parsed_url = urlparse(settings.deployer.portainer_url)
    host = f"http://{parsed_url.hostname}"
    # port = crud.get_available_deployment_port(db)

    deployment = create(db, virtual_assistant.id, host)

    task = tasks.run_deployer_task.delay(deployment_id=deployment.id)
    deployment = update_by_id(db, deployment.id, task_id=task.id)
    db.commit()

    return schemas.DeploymentRead.from_orm(deployment)


def patch_deployment(db: Session, deployment: schemas.DeploymentRead):
    dream_dist = AssistantDist.from_dist(settings.db.dream_root_path / deployment.virtual_assistant.source)
    dream_dist.save(overwrite=True, generate_configs=True)
    dream_git.push_to_copy_remote_origin()

    if deployment.stack_id:
        swarm_client.delete_stack(deployment.stack_id)
    tasks.app.control.revoke(deployment.task_id, terminate=True)

    new_task = tasks.run_deployer_task.delay(deployment_id=deployment.id)
    deployment = update_by_id(db, deployment.id, state="STARTED", task_id=new_task.id)

    return schemas.DeploymentRead.from_orm(deployment)


def delete_deployment(db: Session, deployment: schemas.DeploymentRead):
    try:
        if deployment.stack_id:
            swarm_client.delete_stack(deployment.stack_id)
    except HTTPError:
        pass

    tasks.app.control.revoke(deployment.task_id, terminate=True)
    delete_by_id(db, deployment.id)
    db.commit()


def get_swarm_stacks():
    swarm_client.get_stacks()


def get_swarm_used_ports():
    swarm_client.get_used_ports()


def delete_swarm_stack(stack_id: int, task_id: str):
    # TODO: make better exception handling
    try:
        swarm_client.delete_stack(stack_id)
    except requests.exceptions.HTTPError as e:
        raise HTTPException(500, detail=repr(e))

    tasks.app.control.revoke(task_id, terminate=True)


def get_queue_task_status(task_id: str):
    return tasks.get_task_status(task_id)
