from typing import List, Optional

from fastapi import APIRouter, Depends, Header, status, HTTPException
from sqlalchemy.orm import Session

from database.core import init_db
from apiconfig.config import settings
from database.models.feedback.crud import add_feedback, get_feedback, get_all_feedback_statuses, get_all_feedback_types
from services.feedback_api.auth import get_admin_user
from services.feedback_api.models import FeedbackCreate, UserRead

router = APIRouter(prefix="/feedback")
SessionLocal = init_db(settings.db.user, settings.db.password, settings.db.host, settings.db.port, settings.db.name)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("")
async def create_feedback(
        payload: FeedbackCreate, db: Session = Depends(get_db)
):
    """
    """
    return add_feedback(db, **payload.dict())


@router.get("")
async def get_feedbacks(
        user: UserRead = Depends(get_admin_user),
        type_id: Optional[int] = None,
        status_id: Optional[int] = None,
        db: Session = Depends(get_db)
):
    """
    """
    return get_feedback(db, type_id, status_id)


@router.get("/status/all")
async def get_feedbacks(
        db: Session = Depends(get_db)
):
    """
    """
    return get_all_feedback_statuses(db)


@router.get("/type/all")
async def get_feedbacks(
        db: Session = Depends(get_db)
):
    """
    """
    return get_all_feedback_types(db)
