from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from starlette import status

from database.deployment.crud import get_all, get_by_id
from services.distributions_api import schemas
from services.distributions_api.database_maker import get_db
from services.distributions_api.security.auth import get_current_user, get_current_user_or_none


def get_deployment(deployment_id: int, db: Session = Depends(get_db)):
    deployment = get_by_id(db, deployment_id)
    if not deployment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Deployment {deployment_id} not found")

    return schemas.DeploymentRead.from_orm(deployment)


def get_all_deployments(db: Session = Depends(get_db), state: str = None):
    deployments = get_all(db, state)
    return [schemas.DeploymentRead.from_orm(d) for d in deployments]


def deployment_view_permission(
    user: schemas.UserRead = Depends(get_current_user),
    deployment: schemas.DeploymentRead = Depends(get_deployment),
):
    """"""
    if user.id != deployment.virtual_assistant.author.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="No access")
    return deployment


def deployment_patch_permission(
    user: schemas.UserRead = Depends(get_current_user),
    deployment: schemas.DeploymentRead = Depends(get_deployment),
):
    """"""
    if user.id != deployment.virtual_assistant.author.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="No access")
    return deployment


def deployment_delete_permission(
    user: schemas.UserRead = Depends(get_current_user),
    deployment: schemas.DeploymentRead = Depends(get_deployment),
):
    """"""
    if user.id != deployment.virtual_assistant.author.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="No access")
    return deployment
