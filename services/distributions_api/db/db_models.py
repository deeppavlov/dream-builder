import sqlalchemy
from sqlalchemy import Integer

metadata = sqlalchemy.MetaData()

users_table = sqlalchemy.Table(
    "users",
    metadata,
    sqlalchemy.Column("id", Integer, primary_key=True, nullable=False),
    sqlalchemy.Column("username", sqlalchemy.String(50), primary_key=True, nullable=False),
    sqlalchemy.Column("reg_date", sqlalchemy.String(50), nullable=False),
)

items_history = sqlalchemy.Table(
    "history",
    metadata,
    sqlalchemy.Column("id", sqlalchemy.String(50), nullable=False),
    sqlalchemy.Column("url", sqlalchemy.String(255)),
    sqlalchemy.Column("parent_id", sqlalchemy.String(50)),
    sqlalchemy.Column("item_type", sqlalchemy.String(10), nullable=False),
    sqlalchemy.Column("size", sqlalchemy.Integer()),
    sqlalchemy.Column("date", sqlalchemy.String(50))
)
