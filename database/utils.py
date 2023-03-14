import csv
from pathlib import Path
from typing import Union


def sqlalchemy_url(
    driver: str, user: str, password: str, host: str, port: int, database: str
) -> str:
    """Create sqlalchemy sessionmaker

    Args:
        driver: sqlalchemy driver
        user: database user
        password: user's password
        host: database host
        port: database port
        database: database name

    Returns:
        url-like sqlalchemy connector string
    """
    return f"{driver}://{user}:{password}@{host}:{port}/{database}"


def iter_tsv_rows(path: Union[Path, str]):
    path = Path(path)

    with path.open("r", encoding="utf-8") as tsv_f:
        rd = csv.reader(tsv_f, delimiter="\t", quotechar='"')

        header = next(rd)

        for row in rd:
            yield dict(zip(header, row))
