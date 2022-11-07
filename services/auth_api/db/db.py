from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

db_url = '{engine}://{user}:{password}@{host}:{port}/{database}'.format(
    engine='postgresql+psycopg2',
    user='postgres',
    password='zzz',
    host='localhost',
    port=5432,
    database='postgres',
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
