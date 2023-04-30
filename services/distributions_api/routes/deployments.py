from urllib.parse import urlparse

import requests.exceptions
from deeppavlov_dreamtools import AssistantDist
from deeppavlov_dreamtools.deployer.portainer import SwarmClient
from deeppavlov_dreamtools.deployer.swarm import SwarmDeployer
from fastapi import APIRouter, Depends, HTTPException
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


@deployments_router.post("/")
async def create_deployment(
    payload: schemas.DeploymentCreate, user: schemas.UserRead = Depends(verify_token), db: Session = Depends(get_db)
):
    with db.begin():
        virtual_assistant = crud.get_virtual_assistant(db, payload.virtual_assistant_id)
        dream_dist = AssistantDist.from_dist(settings.db.dream_root_path / virtual_assistant.source)
        deployer = SwarmDeployer(
            user_identifier=dream_dist.name,
            registry_addr=settings.deployer.registry_url,
            user_services=get_user_services(dream_dist),
            deployment_dict={"services": {"agent": {"ports": [f"{payload.assistant_port}:4242"]}}},
            portainer_url=settings.deployer.portainer_url,
            portainer_key=settings.deployer.portainer_key,
            default_prefix=settings.deployer.default_prefix,
        )
        deployer.deploy(dream_dist)
        hostname = urlparse(settings.deployer.portainer_url).hostname
        return f"{hostname}:{payload.assistant_port}"

        # chat_host, chat_port = deployer.deploy(dream_dist)
        # deployment = crud.create_deployment(db, virtual_assistant.id, chat_host, chat_port)

    # return schemas.Deployment.from_orm(deployment)


@deployments_router.get("/")
async def get_stacks():
    return swarm_client.get_stacks()


@deployments_router.delete("/{stack_id}")
async def delete_stack(stack_id: int):
    # TODO: make better exception handling
    try:
        swarm_client.delete_stack(stack_id)
    except requests.exceptions.HTTPError as e:
        raise HTTPException(500, detail=repr(e))


@deployments_router.get("/lm_services", status_code=status.HTTP_200_OK)
async def get_all_lm_services(db: Session = Depends(get_db)):
    """ """
    return [schemas.LmServiceRead.from_orm(name) for name in crud.get_all_lm_services(db)]
