from typing import List

from sqlalchemy import select
from sqlalchemy.orm import Session

from database.models import Plan


def get_all_plans(db: Session) -> List[Plan]:
    return db.scalars(select(Plan)).all()
