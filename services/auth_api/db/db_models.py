from sqlalchemy import Boolean, Column, Integer, String

from db.db import Base


class GoogleUser(Base):
    __tablename__ = "google"

    # id = Column(Integer, primary_key=True, index=True)
    email = Column(String, primary_key=True)
    sub = Column(String)
    picture = Column(String(500), nullable=True)
    fullname = Column(String(100))
    given_name = Column(String(50))
    family_name = Column(String(50))
