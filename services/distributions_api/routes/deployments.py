import asyncio
from datetime import datetime
from urllib.parse import urlparse

from botocore.exceptions import BotoCoreError
import requests.exceptions
from deeppavlov_dreamtools import AssistantDist
from deeppavlov_dreamtools.deployer.portainer import SwarmClient
from deeppavlov_dreamtools.deployer.swarm import SwarmDeployer
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from fastapi.logger import logger
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from starlette import status

from apiconfig.config import settings
from database import crud
from services.distributions_api import schemas
from services.distributions_api.database_maker import get_db
from services.distributions_api.security.auth import verify_token

deployments_router = APIRouter(prefix="/api/deployments", tags=["deployments"])

swarm_client = SwarmClient(settings.deployer.portainer_url, settings.deployer.portainer_key)

# deployer = Deployer(settings.deployer.portainer_key)


def get_user_services(dist: AssistantDist):
    services = dist.compose_override.config.services.keys()
    user_services = [service for service in services if service.endswith("-prompted-skill")]
    user_services.append("agent")
    if "prompt-selector" in services:
        user_services.append("prompt-selector")
    return user_services


def run_deployer(dist: AssistantDist, port: int, deployment_id: int):
    now = datetime.now()
    logger.info(f"Deployment background task for {dist.name} started")

    try:
        db = next(get_db())
        with db.begin():
            crud.update_deployment(db, deployment_id, state="in_progress")

        deployer = SwarmDeployer(
            user_identifier=dist.name,
            registry_addr=settings.deployer.registry_url,
            user_services=get_user_services(dist),
            deployment_dict={"services": {"agent": {"ports": [f"{port}:4242"]}}},
            portainer_url=settings.deployer.portainer_url,
            portainer_key=settings.deployer.portainer_key,
            default_prefix=settings.deployer.default_prefix,
        )
        deployer.deploy(dist)
    except BotoCoreError as e:
        db = next(get_db())
        with db.begin():
            crud.update_deployment(db, deployment_id, state="error")

        logger.error(
            f"Deployment background task for {dist.name} failed after {datetime.now() - now}"
            f"Reason: {type(e).__name__} ({e})"
        )
    else:
        db = next(get_db())
        with db.begin():
            crud.update_deployment(db, deployment_id, state="up")

        logger.info(f"Deployment background task for {dist.name} successfully finished after {datetime.now() - now}")


@deployments_router.post("/", status_code=status.HTTP_201_CREATED)
async def create_deployment(
    payload: schemas.DeploymentCreate,
    background_tasks: BackgroundTasks,
    user: schemas.UserRead = Depends(verify_token),
    db: Session = Depends(get_db),
):
    with db.begin():
        virtual_assistant = crud.get_virtual_assistant(db, payload.virtual_assistant_id)
        dream_dist = AssistantDist.from_dist(settings.db.dream_root_path / virtual_assistant.source)

        parsed_url = urlparse(settings.deployer.portainer_url)
        host = f"{parsed_url.scheme}://{parsed_url.hostname}"
        port = crud.get_available_deployment_port(db)

        try:
            deployment = crud.create_deployment(db, virtual_assistant.id, host, port)
            db.commit()
        except IntegrityError:
            db.rollback()
            raise HTTPException(status_code=status.HTTP_425_TOO_EARLY, detail="Deployment is already in progress!")

    background_tasks.add_task(
        run_deployer,
        dist=dream_dist,
        port=port,
        deployment_id=deployment.id,
    )

    return schemas.DeploymentRead.from_orm(deployment)


@deployments_router.get("/stacks")
async def get_stacks():
    return swarm_client.get_stacks()


@deployments_router.get("/{deployment_id}", status_code=status.HTTP_200_OK)
async def get_deployment(
    deployment_id: int, user: schemas.UserRead = Depends(verify_token), db: Session = Depends(get_db)
):
    with db.begin():
        deployment = crud.get_deployment(db, deployment_id)

    return schemas.DeploymentRead.from_orm(deployment)


@deployments_router.delete("/{deployment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_deployment(
    deployment_id: int, user: schemas.UserRead = Depends(verify_token), db: Session = Depends(get_db)
):
    with db.begin():
        crud.delete_deployment(db, deployment_id)


@deployments_router.delete("/stacks/{stack_id}")
async def delete_stack(stack_id: int):
    # TODO: make better exception handling
    try:
        swarm_client.delete_stack(stack_id)
    except requests.exceptions.HTTPError as e:
        raise HTTPException(500, detail=repr(e))
