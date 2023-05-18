import asyncio
from datetime import datetime
from urllib.parse import urlparse

import requests
from botocore.exceptions import BotoCoreError
import requests.exceptions
from deeppavlov_dreamtools import AssistantDist
from deeppavlov_dreamtools.deployer.portainer import SwarmClient
from deeppavlov_dreamtools.deployer.swarm import SwarmDeployer, DeployerError
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from fastapi.logger import logger
from requests.adapters import HTTPAdapter, Retry
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from starlette import status

from apiconfig.config import settings
from database import crud, enums
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


def ping_deployed_agent(host: str, port: int, retries: int = 10, backoff_factor: float = 1.7):
    with requests.Session() as session:
        retries = Retry(
            total=retries,
            backoff_factor=backoff_factor,
            # status_forcelist=[500, 502, 503, 504],
        )
        session.mount("http://", HTTPAdapter(max_retries=retries))

        response = session.get(f"{host}:{port}/ping", timeout=100)
        response_json = response.json()

        logger.info(f"AGENT RESPONSE {response_json}")
        if response_json == "pong":
            return True


def run_deployer(dist: AssistantDist, deployment_id: int):
    now = datetime.now()
    logger.info(f"Deployment background task for {dist.name} started")

    db = next(get_db())
    with db.begin():
        logger.info(f"Checking available ports")
        port = crud.get_available_deployment_port(db, exclude=list(swarm_client.get_used_ports().values()))
        logger.info(f"Found available port {port}")
        crud.update_deployment(db, deployment_id, chat_port=port)

    deployer = SwarmDeployer(
        user_identifier=dist.name,
        registry_addr=settings.deployer.registry_url,
        user_services=get_user_services(dist),
        deployment_dict={"services": {"agent": {"ports": [f"{port}:4242"]}}},
        portainer_url=settings.deployer.portainer_url,
        portainer_key=settings.deployer.portainer_key,
        default_prefix=settings.deployer.default_prefix,
    )

    for state, updates, err in deployer.deploy(dist):
        db = next(get_db())
        with db.begin():
            if err:
                err = err.dict()
                logger.error(
                    f"Deployment background task for {dist.name} failed after {datetime.now() - now} with {err}"
                )
            else:
                logger.info(f"Deployment background task state changed to {state}")

            deployment = crud.update_deployment(db, deployment_id, state=state, error=err, **updates)

    agent_is_up = ping_deployed_agent(deployment.chat_host, deployment.chat_port)

    db = next(get_db())
    with db.begin():
        if agent_is_up:
            crud.update_deployment(db, deployment_id, state=enums.DeploymentState.UP)

    logger.info(f"Deployment background task for {dist.name} successfully finished after {datetime.now() - now}")


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
    background_tasks: BackgroundTasks,
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
                    ),
                )
            db.commit()
        except IntegrityError:
            db.rollback()
            raise HTTPException(status_code=status.HTTP_425_TOO_EARLY, detail="Deployment is already in progress!")

    if not payload.error:
        background_tasks.add_task(
            run_deployer,
            dist=dream_dist,
            # port=port,
            deployment_id=deployment.id,
        )

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
    background_tasks: BackgroundTasks,
    user: schemas.UserRead = Depends(verify_token),
    db: Session = Depends(get_db),
):
    with db.begin():
        deployment = crud.get_deployment(db, deployment_id)

        dream_dist = AssistantDist.from_dist(settings.db.dream_root_path / deployment.virtual_assistant.source)
        dream_dist.save(overwrite=True, generate_configs=True)

        if deployment.stack_id:
            swarm_client.delete_stack(deployment.stack_id)

        deployment = crud.update_deployment(db, deployment_id, state="STARTED")

    background_tasks.add_task(
        run_deployer,
        dist=dream_dist,
        # port=deployment.chat_port,
        deployment_id=deployment.id,
    )

    return schemas.DeploymentRead.from_orm(deployment)


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
async def delete_stack(stack_id: int):
    # TODO: make better exception handling
    try:
        swarm_client.delete_stack(stack_id)
    except requests.exceptions.HTTPError as e:
        raise HTTPException(500, detail=repr(e))
