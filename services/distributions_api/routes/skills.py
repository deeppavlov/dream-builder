from deeppavlov_dreamtools import list_components
from fastapi import APIRouter, status

from services.distributions_api.const import DREAM_ROOT_PATH

skills_router = APIRouter(prefix="/api/skills")


@skills_router.get("/", status_code=status.HTTP_200_OK)
async def get_list_of_skills():
    skills = list_components(DREAM_ROOT_PATH, "skills")

    return skills
