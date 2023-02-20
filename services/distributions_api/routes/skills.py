import json

from deeppavlov_dreamtools import list_components, AssistantDist
from fastapi import APIRouter, status

from services.distributions_api.const import DREAM_ROOT_PATH

skills_router = APIRouter(prefix="/api/skills")


# @skills_router.get("/", status_code=status.HTTP_200_OK)
# async def get_list_of_skills():
#     skills = list_components(DREAM_ROOT_PATH, "skills")
#
#     return [json.loads(skill.json(exclude_none=True)) for skill in skills]
#
#
# @skills_router.get("/{dist_name}", status_code=status.HTTP_200_OK)
# async def get_list_of_skills_in_dist(dist_name: str):
#     dist = AssistantDist.from_name(dist_name, DREAM_ROOT_PATH)
#
#     return [json.loads(skill.json(exclude_none=True)) for skill in dist.iter_components("skills")]
