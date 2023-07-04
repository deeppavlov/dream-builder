import csv
import typing
from functools import wraps
from pathlib import Path
from typing import Union, Dict, Type, Callable

from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError


def sqlalchemy_url(driver: str, user: str, password: str, host: str, port: int, database: str) -> str:
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


def iter_tsv_rows(
    path: Union[Path, str], map_value_types: Dict[str, Type[bool | int | Callable[[str], bool | int]]] = None
):
    path = Path(path)

    with path.open("r", encoding="utf-8") as tsv_f:
        rd = csv.reader(tsv_f, delimiter="\t", quotechar='"')

        header = next(rd)

        for row in rd:
            cleaned_row = []
            for item in row:
                if item == "":
                    cleaned_row.append(None)
                else:
                    cleaned_row.append(item)

            named_row = dict(zip(header, cleaned_row))

            if map_value_types:
                for column_name, column_type in map_value_types.items():
                    named_row[column_name] = column_type(named_row[column_name])

            yield named_row
