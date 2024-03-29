import logging
from datetime import datetime

import requests
from celery import Celery
from celery.result import AsyncResult
from deeppavlov_dreamtools import AssistantDist
from deeppavlov_dreamtools.deployer.portainer import SwarmClient
from deeppavlov_dreamtools.deployer.swarm import SwarmDeployer
from requests.adapters import HTTPAdapter
from urllib3 import Retry

from apiconfig.config import settings
from database import enums
from database.models.deployment import crud as deployment_crud
from database.core import init_db
from git_storage.git_manager import GitManager

logger = logging.getLogger()


app = Celery("deploy_tasks", broker=settings.celery.broker, backend=settings.celery.backend)

swarm_client = SwarmClient(settings.deployer.portainer_url, settings.deployer.portainer_key)


SessionLocal = init_db(
    settings.db.user,
    settings.db.password,
    settings.db.host,
    settings.db.port,
    settings.db.name,
)


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


# deployer = Deployer(settings.deployer.portainer_key)


def get_user_services(dist: AssistantDist):
    services = dist.compose_override.config.services.keys()
    user_services = [service for service in services if service.endswith("-prompted-skill")]
    user_services.append("agent")
    if "prompt-selector" in services:
        user_services.append("prompt-selector")
    if "prompt-selector-ru" in services:
        user_services.append("prompt-selector-ru")
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

    with SessionLocal() as db:
        with db.begin():
            logger.info(f"Checking available ports")
            port = deployment_crud.get_available_deployment_port(db, exclude=list(swarm_client.get_used_ports().values()))
            logger.info(f"Found available port {port}")
            deployment = deployment_crud.update_by_id(db, deployment_id, chat_port=port)
            chat_host, chat_port = deployment.chat_host, deployment.chat_port

    default_prefix_map = {
        "en": settings.deployer.default_prefix,
        "ru": f"{settings.deployer.default_prefix}ru_",
    }

    deployer = SwarmDeployer(
        user_identifier=dist.name,
        registry_addr=settings.deployer.registry_url,
        user_services=get_user_services(dist),
        deployment_dict={"services": {"agent": {"ports": [f"{port}:4242"]}}},
        portainer_url=settings.deployer.portainer_url,
        portainer_key=settings.deployer.portainer_key,
        default_prefix=default_prefix_map[dist.language],
        cloud_service_name=settings.deployer.cloud_service,
    )

    for state, updates, err in deployer.deploy(dist):
        with SessionLocal() as db:
            with db.begin():
                if err:
                    err = err.dict()
                    logger.error(
                        f"Deployment background task for {dist.name} failed after {datetime.now() - now} with {err}"
                    )
                else:
                    logger.info(f"Deployment background task state changed to {state}")

                deployment_crud.update_by_id(db, deployment_id, state=state, error=err, **updates)

    agent_is_up = ping_deployed_agent(chat_host, chat_port)

    with SessionLocal() as db:
        with db.begin():
            if agent_is_up:
                deployment_crud.update_by_id(db, deployment_id, state=enums.DeploymentState.UP)

    logger.info(f"Deployment background task for {dist.name} successfully finished after {datetime.now() - now}")


@app.task(bind=True, track_started=True, queue="deployments")
def run_deployer_task(*args, **kwargs):
    logger.warning(f"Task started with {kwargs['deployment_id']}")

    dream_git.pull_copy_remote_origin()

    with SessionLocal() as db:
        with db.begin():
            deployment = deployment_crud.get_by_id(db, kwargs["deployment_id"])
            dream_dist = AssistantDist.from_dist(settings.db.dream_root_path / deployment.virtual_assistant.source)

    run_deployer(dream_dist, kwargs["deployment_id"])


def get_task_status(task_id: str):
    result = AsyncResult(task_id)
    # if result.status == "PENDING":
    #     task_status = "Task state is unknown"

    return {
        "status": result.status,
        "result": result.result,
        "is_ready": result.ready(),
        "state": result.state,
        "task_info": result.info,
    }
