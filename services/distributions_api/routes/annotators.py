from fastapi import APIRouter

annotators_router = APIRouter(prefix="/api/annotators")


# @annotators_router.get("/", status_code=status.HTTP_200_OK)
# async def get_list_of_annotators():
#     annotators = list_components(DREAM_ROOT_PATH, "annotators")
#
#     return [json.loads(annotator.json(exclude_none=True)) for annotator in annotators]
#
#
# @annotators_router.get("/{dist_name}", status_code=status.HTTP_200_OK)
# async def get_list_of_annotators_in_dist(dist_name: str):
#     dist = AssistantDist.from_name(dist_name, DREAM_ROOT_PATH)
#
#     return [json.loads(annotator.json(exclude_none=True)) for annotator in dist.iter_components("annotators")]
