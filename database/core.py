from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

Base = declarative_base()


def init_db(
    user: str, password: str, host: str, port: int, database: str, force_recreate: bool = False
) -> sessionmaker:
    """Create sqlalchemy sessionmaker

    Args:
        user: database user
        password: user's password
        host: database host
        port: database port
        database: database name
        force_recreate: force recreate tables

    Returns:
        Callable sessionmaker object
    """
    db_url = f"postgresql+psycopg2://{user}:{password}@{host}:{port}/{database}"
    engine = create_engine(db_url)
    session_callable = sessionmaker(autocommit=False, autoflush=False, bind=engine)

    if force_recreate:
        Base.metadata.drop_all(bind=engine)

    Base.metadata.create_all(bind=engine, checkfirst=not force_recreate)

    return session_callable
