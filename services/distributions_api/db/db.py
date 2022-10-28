import databases
import sqlalchemy

from services.distributions_api.db.db_models import metadata

DATABASE_URL = "postgresql://postgres@0.0.0.0:5432/postgres"

database = databases.Database(DATABASE_URL)

engine = sqlalchemy.create_engine(
    DATABASE_URL
)
metadata.create_all(engine)

