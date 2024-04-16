from typing import List
from sqlalchemy.orm import Session
from sqlalchemy.orm import joinedload
from datetime import datetime

from database.models.feedback.model import FeedBack, Picture


def add_feedback(
    db: Session,
    email: str,
    text: str,
    pictures: list = None
) -> FeedBack:
    new_feedback = FeedBack(email=email, text=text, date_created=datetime.now())

    if pictures:
        picture_objects = [Picture(picture=picture) for picture in pictures]
        new_feedback.pictures.extend(picture_objects)

    db.add(new_feedback)
    db.commit()
    db.refresh(new_feedback)

    return db.query(FeedBack).filter_by(id=new_feedback.id).options(joinedload(FeedBack.pictures)).first()


def get_all_feedbacks(db: Session) -> List[FeedBack]:
    return db.query(FeedBack).options(joinedload(FeedBack.pictures)).all()
