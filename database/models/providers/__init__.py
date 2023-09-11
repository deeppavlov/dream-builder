# This strange import made due to solution of the circular import problem
from database.models.providers import crud
from database.models.providers.crud import Provider
