from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

Base = declarative_base()


def init_db(user: str, password: str, host: str, port: int, database: str) -> sessionmaker:
    """Create sqlalchemy sessionmaker

    Args:
        user: database user
        password: user's password
        host: database host
        port: database port
        database: database name

    Returns:
        Callable sessionmaker object
    """
    db_url = f"postgresql+psycopg2://{user}:{password}@{host}:{port}/{database}"
    engine = create_engine(db_url)
    session_callable = sessionmaker(autocommit=False, autoflush=False, bind=engine)

    Base.metadata.create_all(bind=engine)

    return session_callable
