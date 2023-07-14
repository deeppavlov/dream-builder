from database.models.providers.model import Provider
from sqlalchemy.orm import Session


def get_provider_id_by_name(db: Session, service_name: str):
    return db.query(Provider).filter(Provider.service_name == service_name).first().id
