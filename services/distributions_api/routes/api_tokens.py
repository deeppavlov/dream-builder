from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from starlette import status

from database import crud
from services.distributions_api.database_maker import get_db
from services.distributions_api import schemas
from services.distributions_api.security.auth import verify_token

tokens_router = APIRouter(prefix="/api/api_tokens", tags=["api_tokens"])


@tokens_router.get("/", status_code=status.HTTP_200_OK)
async def get_all_api_tokens(user: str = Depends(verify_token), db: Session = Depends(get_db)):
    tokens = crud.get_all_api_tokens(db)
    return [schemas.ApiToken.from_orm(t) for t in tokens]
