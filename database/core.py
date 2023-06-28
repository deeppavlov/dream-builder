import time

from sqlalchemy import create_engine, Engine
from sqlalchemy.orm import sessionmaker, Session, declarative_base, DeclarativeMeta
from sqlalchemy.exc import OperationalError

# from database.scripts import register_initial_data_population

Base = declarative_base()


class Database:
    def __init__(
        self,
        base: DeclarativeMeta,
        engine: Engine,
        session_callable: sessionmaker,
    ):
        self.base = base
        self.engine = engine
        self.sessionmaker = session_callable

    def __call__(self, **kwargs) -> Session:
        return self.sessionmaker(**kwargs)


def init_db(
    user: str,
    password: str,
    host: str,
    port: int,
    database: str,
    force_recreate: bool = False,
    # populate_initial_data: bool = False,
) -> Database:
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

    database = Database(Base, engine, session_callable)
    retry_count = 0
    MAX_RETRIES = 3
    RETRY_DELAY_SEC = 2
    while retry_count < MAX_RETRIES:
        try:
            if force_recreate:
                print(f"Dropping all tables because force_recreate = {force_recreate}")
                # Base.metadata.drop_all(bind=engine)
                database.base.metadata.clear()

            database.base.metadata.create_all(bind=engine, checkfirst=True)
            break  # Successful initialization, break out of the retry loop

        except OperationalError as e:
            retry_count += 1
            print(f"Database initialization failed. Retrying ({retry_count}/{MAX_RETRIES})...")
            time.sleep(RETRY_DELAY_SEC)

    if retry_count == MAX_RETRIES:
        raise RuntimeError("Failed to initialize the database after multiple retries")

    return database
