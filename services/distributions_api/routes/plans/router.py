from typing import List

from fastapi import APIRouter, Depends
from starlette import status
from sqlalchemy.orm import Session

from database.models.plan.crud import get_all_plans
from services.distributions_api import schemas
from services.distributions_api.database_maker import get_db
from services.distributions_api.security.auth import get_current_user


plans_router = APIRouter(prefix="/api/plans", tags=["plans"])


@plans_router.get("", status_code=status.HTTP_200_OK)
async def get_plans(
    user: schemas.UserRead = Depends(get_current_user), db: Session = Depends(get_db)
) -> List[schemas.PlanResponse]:
    """
    """
    return [schemas.PlanResponse.from_orm(plan) for plan in get_all_plans(db)]
