from apiconfig.config import settings
from database.core import init_db


SessionLocal = init_db(
    settings.db.user,
    settings.db.password,
    settings.db.host,
    settings.db.port,
    settings.db.name,
    # populate_initial_data=True,
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
