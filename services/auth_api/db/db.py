from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from config import config

db_url = "{engine}://{user}:{password}@{host}:{port}/{database}".format(
    engine="postgresql+psycopg2",
    user="postgres" if not config["db"]["user"] else config["db"]["user"],
    password="postgres" if not config["db"]["password"] else config["db"]["password"],
    host="localhost" if not config["db"]["host"] else config["db"]["host"],
    port=5432 if not config["db"]["port"] else int(config["db"]["port"]),
    database="postgres" if not config["db"]["database"] else config["db"]["database"],
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
