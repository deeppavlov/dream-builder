# This strange import made due to solution of the circular import problem
from database.models.github_user import crud
from database.models.github_user.crud import GithubUser
