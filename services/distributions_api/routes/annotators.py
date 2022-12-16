import json

from deeppavlov_dreamtools import list_components
from fastapi import APIRouter, status

from services.distributions_api.const import DREAM_ROOT_PATH

annotators_router = APIRouter(prefix="/api/annotators")


@annotators_router.get("/", status_code=status.HTTP_200_OK)
async def get_list_of_annotators():
    annotators = list_components(DREAM_ROOT_PATH, "annotators")

    return [json.loads(annotator.json(exclude_none=True)) for annotator in annotators]
