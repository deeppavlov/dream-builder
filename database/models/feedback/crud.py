from typing import List
from sqlalchemy.orm import Session
from sqlalchemy.orm import joinedload
from datetime import datetime
from fastapi import HTTPException

from database.models.feedback.model import FeedBack, Picture, FeedbackStatus, FeedbackType
from services.feedback_api.models import FeedbackType as FeedbackTypeModel, FeedbackResponse


def add_feedback(
    db: Session,
    feedback_type: FeedbackTypeModel,
    email: str,
    text: str,
    pictures: list = None
) -> FeedbackResponse:
    new_feedback = FeedBack(email=email, text=text, type_id=feedback_type["id"], status_id=1, date_created=datetime.now())

    if pictures:
        picture_objects = [Picture(picture=picture) for picture in pictures]
        new_feedback.pictures.extend(picture_objects)

    db.add(new_feedback)
    db.commit()
    db.refresh(new_feedback)

    feedback = db.query(FeedBack).filter_by(id=new_feedback.id).options(joinedload(FeedBack.pictures)).first()

    feedback_dict = feedback.__dict__
    feedback_dict["type"] = {"id": feedback.type.id, "name": feedback.type.name}
    feedback_dict["status"] = {"id": feedback.status.id, "name": feedback.status.name}
    feedback_dict["pictures"] = [{"id": picture.id, "picture": picture.picture} for picture in feedback.pictures]

    return FeedbackResponse(**feedback_dict)


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

    feedbacks = query.options(joinedload(FeedBack.pictures), joinedload(FeedBack.type),
                              joinedload(FeedBack.status)).all()

    feedback_responses = []
    for feedback in feedbacks:
        feedback_dict = feedback.__dict__
        feedback_dict["type"] = {"id": feedback.type.id, "name": feedback.type.name}
        feedback_dict["status"] = {"id": feedback.status.id, "name": feedback.status.name}
        feedback_dict["pictures"] = [{"id": picture.id, "picture": picture.picture} for picture in feedback.pictures]
        feedback_responses.append(FeedbackResponse(**feedback_dict))

    return feedback_responses


def get_all_feedback_types(db: Session) -> list[FeedbackType]:
    return db.query(FeedbackType).all()


def get_all_feedback_statuses(db: Session) -> list[FeedbackStatus]:
    return db.query(FeedbackStatus).all()


def update_feedback_status_by_id(db: Session, feedback_id: int, status_id: int) -> FeedbackResponse:
    feedback = db.query(FeedBack).filter(FeedBack.id == feedback_id).first()

    if not feedback:
        raise HTTPException(status_code=404, detail="Feedback not found")

    feedback.status_id = status_id
    db.commit()

    feedback = db.query(FeedBack).filter_by(id=feedback_id).options(joinedload(FeedBack.pictures)).first()

    feedback_dict = feedback.__dict__
    feedback_dict["type"] = {"id": feedback.type.id, "name": feedback.type.name}
    feedback_dict["status"] = {"id": feedback.status.id, "name": feedback.status.name}
    feedback_dict["pictures"] = [{"id": picture.id, "picture": picture.picture} for picture in feedback.pictures]

    return FeedbackResponse(**feedback_dict)
