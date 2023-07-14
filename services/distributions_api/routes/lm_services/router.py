from fastapi import Depends, APIRouter
from sqlalchemy.orm import Session
from starlette import status

from database.models.lm_service import crud
from services.distributions_api import schemas
from services.distributions_api.database_maker import get_db
from services.distributions_api.routes.lm_services.dependencies import LmServices

lm_services_router = APIRouter(prefix="/api/lm_services", tags=["lm_services"])


@lm_services_router.get("", status_code=status.HTTP_200_OK, response_model=list[schemas.LmServiceRead])
async def get_all_lm_services(lm_services: LmServices):
    """ """
    return lm_services
