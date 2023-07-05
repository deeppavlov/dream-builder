from datetime import datetime

from sqlalchemy import select, update, delete
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.orm import Session

from database import enums
from database.publish_request.model import PublishRequest


def get_all_publish_requests(db: Session):
    return db.scalars(select(PublishRequest)).all()


def get_unreviewed_publish_requests(db: Session):
    return db.scalars(select(PublishRequest).filter(PublishRequest.state == enums.PublishRequestState.IN_REVIEW)).all()


def approve_publish_request(db: Session, id: int, reviewed_by_user_id: int) -> PublishRequest:
    return db.scalar(
        update(PublishRequest)
        .filter(PublishRequest.id == id)
        .values(
            state=enums.PublishRequestState.APPROVED,
            reviewed_by_user_id=reviewed_by_user_id,
            date_reviewed=datetime.utcnow(),
        )
        .returning(PublishRequest)
    )


def reject_publish_request(db: Session, id: int, reviewed_by_user_id: int) -> PublishRequest:
    return db.scalar(
        update(PublishRequest)
        .filter(PublishRequest.id == id)
        .values(
            state=enums.PublishRequestState.REJECTED,
            reviewed_by_user_id=reviewed_by_user_id,
            date_reviewed=datetime.utcnow(),
        )
        .returning(PublishRequest)
    )


def create_publish_request(
    db: Session,
    virtual_assistant_id: int,
    user_id: int,
    slug: str,
    public_visibility: enums.VirtualAssistantPublicVisibility,
):
    return db.scalar(
        insert(PublishRequest)
        .values(
            virtual_assistant_id=virtual_assistant_id, user_id=user_id, slug=slug, public_visibility=public_visibility
        )
        .on_conflict_do_update(
            index_elements=[PublishRequest.slug],
            set_=dict(
                public_visibility=public_visibility,
                date_created=datetime.utcnow(),
                state=enums.PublishRequestState.IN_REVIEW,
                reviewed_by_user_id=None,
                date_reviewed=None,
            ),
        )
        .returning(PublishRequest)
    )


def create_publish_request_autoconfirm(db: Session, virtual_assistant_id: int, user_id: int, slug: str):
    return db.scalar(
        insert(PublishRequest)
        .values(
            virtual_assistant_id=virtual_assistant_id,
            user_id=user_id,
            slug=slug,
            visibility="unlisted",
            is_confirmed=True,
            reviewed_by_user_id=1,
            date_reviewed=datetime.utcnow(),
        )
        .on_conflict_do_update(
            index_elements=[PublishRequest.slug],
            set_=dict(
                visibility="unlisted",
                date_created=datetime.utcnow(),
                is_confirmed=True,
                reviewed_by_user_id=1,
                date_reviewed=datetime.utcnow(),
            ),
        )
        .returning(PublishRequest)
    )


def delete_publish_request(db: Session, virtual_assistant_id: int):
    db.execute(delete(PublishRequest).filter_by(virtual_assistant_id=virtual_assistant_id))
