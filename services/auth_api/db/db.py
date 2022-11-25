from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from config import settings

db_url = "{engine}://{user}:{password}@{host}:{port}/{database}".format(
    engine="postgresql+psycopg2",
    user="postgres" if not settings.db_user else settings.db_user,
    password="postgres" if not settings.db_password else settings.db_password,
    host="localhost" if not settings.db_host else settings.db_host,
    port=5432 if not settings.db_port else settings.db_port,
    database="postgres" if not settings.db_name else settings.db_name,
)

engine = create_engine(db_url)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
