from urllib.parse import urlparse

import requests
import requests.exceptions
from deeppavlov_dreamtools import AssistantDist
from deeppavlov_dreamtools.deployer.portainer import SwarmClient
from deeppavlov_dreamtools.deployer.swarm import DeployerError
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from starlette import status

from apiconfig.config import settings
from database import crud, enums
from deployment_queue import tasks
from services.distributions_api import schemas
from services.distributions_api.database_maker import get_db
from services.distributions_api.security.auth import verify_token

deployments_router = APIRouter(prefix="/api/deployments", tags=["deployments"])

swarm_client = SwarmClient(settings.deployer.portainer_url, settings.deployer.portainer_key)


@deployments_router.get("", status_code=status.HTTP_200_OK)
async def get_deployments(
    state: str = None,
    user: schemas.UserRead = Depends(verify_token),
    db: Session = Depends(get_db),
):
    with db.begin():
        deployments = crud.get_all_deployments(db, state)

    return [schemas.DeploymentRead.from_orm(d) for d in deployments]


@deployments_router.post("", status_code=status.HTTP_201_CREATED)
async def create_deployment(
    payload: schemas.DeploymentCreate,
    user: schemas.UserRead = Depends(verify_token),
    db: Session = Depends(get_db),
):
    with db.begin():
        virtual_assistant = crud.get_virtual_assistant_by_name(db, payload.virtual_assistant_name)
        dream_dist = AssistantDist.from_dist(settings.db.dream_root_path / virtual_assistant.source)
        dream_dist.save(overwrite=True, generate_configs=True)

        parsed_url = urlparse(settings.deployer.portainer_url)
        host = f"http://{parsed_url.hostname}"
        # port = crud.get_available_deployment_port(db)

        try:
            deployment = crud.create_deployment(db, virtual_assistant.id, host)
            if payload.error:
                crud.update_deployment(
                    db,
                    deployment.id,
                    state=enums.DeploymentState.BUILDING_IMAGE,
                    error=DeployerError(
                        state=enums.DeploymentState.BUILDING_IMAGE.value,
                        exc=Exception(f"Oh no! Something bad happened during deployment"),
                    ).dict(),
                )
            db.commit()
        except IntegrityError:
            db.rollback()
            raise HTTPException(status_code=status.HTTP_425_TOO_EARLY, detail="Deployment is already in progress!")

        task_id = None
        if not payload.error:
            task_id = tasks.run_deployer_task.delay(
                dist=dream_dist,
                deployment_id=deployment.id,
            ).id
            deployment = crud.update_deployment(db, deployment.id, task_id=task_id)

    return schemas.DeploymentRead.from_orm(deployment)


@deployments_router.get("/stacks")
async def get_stacks():
    return swarm_client.get_stacks()


@deployments_router.get("/stack_ports")
async def get_stack_ports():
    return swarm_client.get_used_ports()


@deployments_router.get("/{deployment_id}", status_code=status.HTTP_200_OK, response_model=schemas.DeploymentRead)
async def get_deployment(
    deployment_id: int, user: schemas.UserRead = Depends(verify_token), db: Session = Depends(get_db)
):
    with db.begin():
        try:
            deployment = crud.get_deployment(db, deployment_id)
        except ValueError as e:
            raise HTTPException(status_code=404, detail=str(e))

    return schemas.DeploymentRead.from_orm(deployment)


@deployments_router.patch("/{deployment_id}", status_code=status.HTTP_200_OK)
async def patch_deployment(
    deployment_id: int,
    task_id: str,
    user: schemas.UserRead = Depends(verify_token),
    db: Session = Depends(get_db),
):
    with db.begin():
        deployment = crud.get_deployment(db, deployment_id)

        dream_dist = AssistantDist.from_dist(settings.db.dream_root_path / deployment.virtual_assistant.source)
        dream_dist.save(overwrite=True, generate_configs=True)

        if deployment.stack_id:
            swarm_client.delete_stack(deployment.stack_id)
        tasks.app.control.revoke(task_id, terminate=True)

        deployment = crud.update_deployment(db, deployment_id, state="STARTED")

        new_task_id = tasks.run_deployer_task.delay(
            dist=dream_dist,
            deployment_id=deployment.id,
        )

    return {"task_id": new_task_id, **schemas.DeploymentRead.from_orm(deployment).__dict__}


@deployments_router.delete("/{deployment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_deployment(
    deployment_id: int, user: schemas.UserRead = Depends(verify_token), db: Session = Depends(get_db)
):
    with db.begin():
        deployment = crud.get_deployment(db, deployment_id)

        if deployment.stack_id:
            swarm_client.delete_stack(deployment.stack_id)

        crud.delete_deployment(db, deployment_id)


@deployments_router.delete("/stacks/{stack_id}")
async def delete_stack(stack_id: int, task_id: str):
    # TODO: make better exception handling
    try:
        swarm_client.delete_stack(stack_id)
    except requests.exceptions.HTTPError as e:
        raise HTTPException(500, detail=repr(e))

    tasks.app.control.revoke(task_id, terminate=True)


@deployments_router.get("/task/{task_id}")
async def get_task_status(task_id: str):
    return tasks.get_task_status(task_id)
