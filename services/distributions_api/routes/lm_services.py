from fastapi import Depends, APIRouter
from sqlalchemy.orm import Session
from starlette import status

from database import crud
from services.distributions_api import schemas
from services.distributions_api.database_maker import get_db

lm_services_router = APIRouter(prefix="/api/lm_services", tags=["lm_services"])


@lm_services_router.get("", status_code=status.HTTP_200_OK)
async def get_all_lm_services(db: Session = Depends(get_db)):
    """ """
    return [schemas.LmServiceRead.from_orm(name) for name in crud.get_all_lm_services(db, hosted_only=True)]
