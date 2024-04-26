from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Table, LargeBinary, func
from sqlalchemy.orm import relationship
from database.core import Base


class FeedBack(Base):
    __tablename__ = "feedback"

    id = Column(Integer, primary_key=True)
    email = Column(String)
    text = Column(String)
    date_created = Column(DateTime, default=func.now())

    pictures = relationship("Picture", secondary="feedback_picture")


class Picture(Base):
    __tablename__ = "picture"

    id = Column(Integer, primary_key=True)
    picture = Column(LargeBinary)


class FeedbackPicture(Base):
    __tablename__ = "feedback_picture"

    id = Column(Integer, primary_key=True)
    feedback_id = Column(Integer, ForeignKey("feedback.id"))
    picture_id = Column(Integer, ForeignKey("picture.id"))
