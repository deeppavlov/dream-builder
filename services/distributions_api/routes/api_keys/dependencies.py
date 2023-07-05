from fastapi import Depends
from sqlalchemy.orm import Session

from database.api_key.crud import get_all
from services.distributions_api import schemas
from services.distributions_api.database_maker import get_db


def get_all_api_keys(db: Session = Depends(get_db)):
    api_keys = get_all(db)
    return [schemas.ApiKeyRead.from_orm(k) for k in api_keys]
