from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from starlette import status

from database import crud
from services.distributions_api.database_maker import get_db
from services.distributions_api import schemas
from services.distributions_api.security.auth import get_current_user

tokens_router = APIRouter(prefix="/api/api_keys", tags=["api_keys"])


@tokens_router.get("", status_code=status.HTTP_200_OK)
async def get_all_api_keys(user: str = Depends(get_current_user), db: Session = Depends(get_db)):
    api_keys = crud.get_all_api_keys(db)

    return [schemas.ApiKeyRead.from_orm(t) for t in api_keys]
