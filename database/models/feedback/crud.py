from typing import List
from sqlalchemy.orm import Session
from sqlalchemy.orm import joinedload
from datetime import datetime

from database.models.feedback.model import FeedBack, Picture, FeedbackStatus, FeedbackType
from services.feedback_api.models import FeedbackType as FeedbackTypeModel


def add_feedback(
    db: Session,
    feedback_type: FeedbackTypeModel,
    email: str,
    text: str,
    pictures: list = None
) -> FeedBack:
    new_feedback = FeedBack(email=email, text=text, type_id=feedback_type["id"], status_id=1, date_created=datetime.now())

    if pictures:
        picture_objects = [Picture(picture=picture) for picture in pictures]
        new_feedback.pictures.extend(picture_objects)

    db.add(new_feedback)
    db.commit()
    db.refresh(new_feedback)

    return db.query(FeedBack).filter_by(id=new_feedback.id).options(joinedload(FeedBack.pictures)).first()


def get_feedback(
    db: Session,
    type_id: int = None,
    status_id: int = None
) -> List[FeedBack]:
    query = db.query(FeedBack)

    if type_id:
        query = query.filter(FeedBack.type_id == type_id)

    if status_id:
        query = query.filter(FeedBack.status_id == status_id)

    return query.options(joinedload(FeedBack.pictures), joinedload(FeedBack.type), joinedload(FeedBack.status)).all()


def get_all_feedback_types(db: Session) -> list[FeedbackType]:
    return db.query(FeedbackType).all()


def get_all_feedback_statuses(db: Session) -> list[FeedbackStatus]:
    return db.query(FeedbackStatus).all()
