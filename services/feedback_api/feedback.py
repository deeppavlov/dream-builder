from fastapi import APIRouter, Depends, Header, status, HTTPException
from sqlalchemy.orm import Session

from database.core import init_db
from apiconfig.config import settings
from database.models.feedback.crud import add_feedback, get_all_feedbacks
from services.feedback_api.models import FeedbackCreate, FeedbackResponse

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


@router.get("/all_feedbacks")
async def get_feedbacks(
        db: Session = Depends(get_db)
):
    """
    For testing
    """
    return get_all_feedbacks(db)
