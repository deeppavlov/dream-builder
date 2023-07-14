from typing import Annotated, List

from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from starlette import status

from database.models import LmService
from database.models.lm_service import crud
from services.distributions_api import schemas
from services.distributions_api.database_maker import get_db


def get_all_lm_services(db: Session = Depends(get_db)) -> List[LmService]:
    lm_services = crud.get_all_lm_services(db, hosted_only=True)
    return lm_services


LmServices = Annotated[List[LmService], Depends(get_all_lm_services)]
