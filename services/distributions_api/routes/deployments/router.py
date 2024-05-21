from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from starlette import status

from database.models.virtual_assistant.crud import count_active_user_deployments
from services.distributions_api import schemas
from services.distributions_api.database_maker import get_db
from services.distributions_api.routes.deployments import flows
from services.distributions_api.routes.deployments.dependencies import (
    get_all_deployments,
    deployment_view_permission,
    deployment_patch_permission,
    deployment_delete_permission,
)
from services.distributions_api.security.auth import get_current_user, get_admin_user

deployments_router = APIRouter(prefix="/api/deployments", tags=["deployments"])


@deployments_router.get("", status_code=status.HTTP_200_OK)
async def get_deployments(
    deployments: List[schemas.DeploymentRead] = Depends(get_all_deployments), db: Session = Depends(get_db)
):
    return deployments


@deployments_router.post("", status_code=status.HTTP_201_CREATED)
async def create_deployment(
    payload: schemas.DeploymentCreate, user: schemas.UserRead = Depends(get_current_user), db: Session = Depends(get_db)
):
    if count_active_user_deployments(user.id, db) >= user.plan.max_active_assistants:
        raise HTTPException(status_code=403, detail="You have exceeded your deployment limit for virtual assistants!")

    deployment = flows.create_deployment(db, payload)
    return deployment


@deployments_router.get("/stacks")
async def get_stacks(user: schemas.UserRead = Depends(get_admin_user)):
    return flows.get_swarm_stacks()


@deployments_router.get("/stack_ports")
async def get_stack_ports(user: schemas.UserRead = Depends(get_admin_user)):
    return flows.get_swarm_used_ports()


@deployments_router.get("/{deployment_id}", status_code=status.HTTP_200_OK, response_model=schemas.DeploymentRead)
async def get_deployment(deployment: schemas.DeploymentRead = Depends(deployment_view_permission)):
    return deployment


@deployments_router.patch("/{deployment_id}", status_code=status.HTTP_200_OK)
async def patch_deployment(
    deployment: schemas.DeploymentRead = Depends(deployment_patch_permission), db: Session = Depends(get_db)
):
    return flows.patch_deployment(db, deployment)


@deployments_router.delete("/{deployment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_deployment(
    deployment: schemas.DeploymentRead = Depends(deployment_delete_permission), db: Session = Depends(get_db)
):
    flows.delete_deployment(db, deployment)


@deployments_router.delete("/stacks/{stack_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_stack(stack_id: int, task_id: str, user: schemas.UserRead = Depends(get_admin_user)):
    flows.delete_swarm_stack(stack_id, task_id)


@deployments_router.get("/task/{task_id}", status_code=status.HTTP_200_OK)
async def get_task_status(task_id: str, user: schemas.UserRead = Depends(get_admin_user)):
    return flows.get_queue_task_status(task_id)
