# This strange import made due to solution of the circular import problem

from database.models.user import crud
from database.models.user.crud import GeneralUser

model = GeneralUser
