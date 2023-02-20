import secrets
from typing import List

from deeppavlov_dreamtools.distconfigs.assistant_dists import AssistantDist, list_dists
from deeppavlov_dreamtools.distconfigs.assistant_dists import (
    DreamComposeDev,
    DreamComposeOverride,
    DreamComposeProxy,
    DreamPipeline,
)
from deeppavlov_dreamtools.distconfigs.generics import Component
from fastapi import APIRouter, status, Depends

from services.distributions_api.const import DREAM_ROOT_PATH
from services.distributions_api.models import (
    AssistantDistModel,
    AssistantDistModelShort,
    CreateAssistantDistModel,
    CloneAssistantDistModel,
    EditAssistantDistModel,
)
from services.distributions_api.security.auth import verify_token

assistant_dists_router = APIRouter(prefix="/api/assistant_dists")


def _generate_name_from_display_name(display_name: str):
    normalized_name = display_name.replace(" ", "_").lower()
    random_id = secrets.token_hex(4)
    return f"{normalized_name}_{random_id}"


def _dist_to_distmodel_short(dream_dist: AssistantDist) -> AssistantDistModelShort:
    """
    AssistantDist -> AssistantDistModelShort
    """
    return AssistantDistModelShort(
        name=dream_dist.name,
        **dream_dist.pipeline_conf.config.metadata.dict(),
    )


def _dist_to_distmodel(dream_dist: AssistantDist) -> AssistantDistModel:
    """
    AssistantDist -> AssistantDistModel
    """
    return AssistantDistModel(
        dist_path=str(dream_dist.dist_path),
        name=dream_dist.name,
        dream_root=str(dream_dist.dream_root),
        pipeline_conf=dream_dist.pipeline_conf.config if dream_dist.pipeline_conf else None,
        compose_override=dream_dist.compose_override.config if dream_dist.compose_override else None,
        compose_dev=dream_dist.compose_dev.config if dream_dist.compose_dev else None,
        compose_proxy=dream_dist.compose_proxy.config if dream_dist.compose_proxy else None,
    )


def _distmodel_to_dist(dream_dist_model: AssistantDistModel) -> AssistantDist:
    """
    Pydantic model to python object
    AssistantDistModel -> AssistantDist
    """
    return AssistantDist(
        dist_path=dream_dist_model.dist_path,
        name=dream_dist_model.name,
        dream_root=dream_dist_model.dream_root,
        pipeline_conf=DreamPipeline(dream_dist_model.pipeline_conf),
        compose_override=DreamComposeOverride(dream_dist_model.compose_override),
        compose_dev=DreamComposeDev(dream_dist_model.compose_dev),
        compose_proxy=DreamComposeProxy(dream_dist_model.compose_proxy),
    )


# def _component_to_component_short(component: Component) -> ComponentShort:
#     return ComponentShort(name=component.name, **component.metadata.dict())


@assistant_dists_router.post("/", status_code=status.HTTP_201_CREATED)
async def create_distribution(payload: CreateAssistantDistModel):
    dream_dist = AssistantDist.from_name("dream", DREAM_ROOT_PATH)

    new_name = _generate_name_from_display_name(payload.display_name)
    new_dist = dream_dist.clone(new_name, payload.description)
    new_dist.save()

    return _dist_to_distmodel(new_dist)


@assistant_dists_router.get("/public", status_code=status.HTTP_200_OK)
async def get_list_of_public_distributions() -> List[AssistantDistModelShort]:
    """
    Returns list of dream distributions in format {name: AssistantDistModel}, i.e. {"deepy_adv": AssistantDistModel}

    Very expensive endpoint. Run it carefully.
    """
    distributions = list_dists(DREAM_ROOT_PATH)
    distributions = [_dist_to_distmodel_short(dist) for dist in distributions]

    return distributions


@assistant_dists_router.get("/private", status_code=status.HTTP_200_OK)
async def get_list_of_private_distributions(token: str = Depends(verify_token)) -> List[AssistantDistModelShort]:
    """
    Returns list of dream distributions in format {name: AssistantDistModel}, i.e. {"deepy_adv": AssistantDistModel}

    Very expensive endpoint. Run it carefully.
    """
    # distributions = list_dists(DREAM_ROOT_PATH)
    # distributions = [_dist_to_distmodel_short(dist) for dist in distributions]

    return []


@assistant_dists_router.get("/{dist_name}")
async def get_dist_by_name(dist_name: str, token: str = Depends(verify_token)) -> AssistantDistModel:
    """
    Returns existing dist with the given name

    Args:
        dist_name: name of the distribution
        token: jwt token

    """
    dream_dist = AssistantDist.from_name(name=dist_name, dream_root=DREAM_ROOT_PATH)
    return _dist_to_distmodel(dream_dist)


@assistant_dists_router.patch("/{dist_name}", status_code=status.HTTP_200_OK)
async def patch_dist_by_name(
    dist_name: str, payload: EditAssistantDistModel, token: str = Depends(verify_token)
) -> AssistantDistModelShort:
    """
    Returns existing dist with edited name and/or description

    Args:
        dist_name: name of the distribution
        payload: request data
        token: jwt token

    """
    dream_dist = AssistantDist.from_name(name=dist_name, dream_root=DREAM_ROOT_PATH)

    if payload.display_name:
        dream_dist.pipeline_conf.display_name = payload.display_name

    if payload.description:
        dream_dist.pipeline_conf.description = payload.description

    dream_dist.save(overwrite=True)

    return _dist_to_distmodel_short(dream_dist)


@assistant_dists_router.delete("/{dist_name}")
async def delete_dist_by_name(
    dist_name: str, token: str = Depends(verify_token)
):
    """
    Deletes existing dist

    Args:
        dist_name: name of the distribution
        token: jwt token

    """
    dream_dist = AssistantDist.from_name(name=dist_name, dream_root=DREAM_ROOT_PATH)
    dream_dist.delete()


@assistant_dists_router.post("/{dist_name}/clone", status_code=status.HTTP_201_CREATED)
async def clone_dist(
    dist_name: str, payload: CloneAssistantDistModel, token: str = Depends(verify_token)
) -> AssistantDistModelShort:
    """
    Returns existing dist with the given name

    Args:
        dist_name: name of the distribution
        payload: request data
        token: jwt token

    """
    dream_dist = AssistantDist.from_name(dist_name, DREAM_ROOT_PATH)

    new_name = _generate_name_from_display_name(payload.display_name)
    new_dist = dream_dist.clone(new_name, payload.display_name, payload.description)
    new_dist.save(overwrite=False)

    return _dist_to_distmodel_short(new_dist)


# @assistant_dists_router.put("/{dist_name}", status_code=status.HTTP_200_OK)
# async def replace_dist(dist_name: str, replacement: AssistantDistModel, token: str = Depends(verify_token)) -> None:
#     """
#     Replaces distribution dist_name (assistant_dists/dist_name) with the *replacement_dist_name* distribution
#
#     Args:
#         dist_name: name of distribution to be replaced
#         replacement: replacement AssistantDist
#         token:
#     """
#     replacement = _distmodel_to_dist(replacement)
#     replacement.name = dist_name
#
#     replacement.save(overwrite=True)
#     return _dist_to_distmodel(replacement)
#
#
# @assistant_dists_router.post("/{dist_name}", status_code=status.HTTP_201_CREATED)
# async def create_config(dist_name: str, configs: AssistantDistConfigsImport, token: str = Depends(verify_token)):
#     """
#     Initializes config attribute into dream_dist object. If config is empty it won't be saved in dream distribution
#
#     Args:
#         dist_name: name of the distribution
#         configs: json with config parameters. Example of json: { "name": name, "data": { "pipeline_conf": ...,
#         "override": ..., ...}
#         token:
#     """
#     dream_dist = AssistantDist.from_name(name=dist_name, dream_root=DREAM_ROOT_PATH)
#
#     for config_name, config_value in configs.data.items():
#         if not config_value:
#             continue
#
#         # for example, dream_dist.pipeline_conf = config.data.pipeline_conf
#         setattr(dream_dist, config_name, config_value)
#
#     dream_dist.save(overwrite=True)
#     return _dist_to_distmodel(dream_dist)
#
#
# @assistant_dists_router.get("/{dist_name}/{config_name}")
# async def get_config_by_name(
#     dist_name: str, config_name: DreamConfigLiteral, token: str = Depends(verify_token)
# ) -> AnyConfigClass:
#     """
#     Returns config (pydantic model)
#     """
#     dream_dist_obj = AssistantDist.from_name(name=dist_name, dream_root=DREAM_ROOT_PATH)
#     config: AnyConfigClass = getattr(dream_dist_obj, config_name)
#     return config
#
#
# @assistant_dists_router.put("/{dist_name}/{config_name}", status_code=status.HTTP_201_CREATED)
# async def replace_config_of_dist(
#     dist_name: str,
#     config_name: DreamConfigLiteral,
#     new_config: AssistantDistConfigsImport,
#     token: str = Depends(verify_token),
# ):
#     """
#     Edits distribution with name=dist_name by adding new_config
#     """
#     dream_dist = AssistantDist.from_name(name=dist_name, dream_root=DREAM_ROOT_PATH)
#
#     # Example of logic:
#     # dream_dist.pipeline_conf = new_config.data.pipeline_conf  -- dist.pipeline_conf = json.data.pipeline_conf
#     setattr(dream_dist, config_name, getattr(new_config.data, config_name))
#
#     dream_dist.save(overwrite=True)
#     return _dist_to_distmodel(dream_dist)
#
#
# @assistant_dists_router.get("/{dist_name}/components/")
# async def get_config_services_by_group(dist_name: str, token: str = Depends(verify_token)):
#     dist = AssistantDist.from_name(name=dist_name, dream_root=DREAM_ROOT_PATH)
#
#     all_components = {}
#
#     groups = [
#         "annotators",
#         "skill_selectors",
#         "skills",
#         "candidate_annotators",
#         "response_selectors",
#         "response_annotators",
#     ]
#     for component_group in groups:
#         components = []
#
#         for component in dist.iter_components(component_group):
#             components.append(_component_to_component_short(component))
#
#         all_components[component_group] = components
#
#     return all_components
#
#
# @assistant_dists_router.get("/{dist_name}/components/{component_group}")
# async def get_config_services_by_group(dist_name: str, component_group: str, token: str = Depends(verify_token)):
#     dist = AssistantDist.from_name(name=dist_name, dream_root=DREAM_ROOT_PATH)
#     return list(_component_to_component_short(c) for c in dist.iter_components(component_group))
#
#
# @assistant_dists_router.post("/{dist_name}/add_service/", status_code=status.HTTP_201_CREATED)
# async def add_service_to_dist(dist_name: str, service_name: str, port: int, token: str = Depends(verify_token)):
#     """ """
#     dream_dist = AssistantDist.from_name(name=dist_name, dream_root=DREAM_ROOT_PATH)
#     dream_dist.add_service(name=service_name, port=port)
#
#     dream_dist.save(overwrite=True)
#     return _dist_to_distmodel(dream_dist)
#
#
# @assistant_dists_router.post("/{dist_name}/remove_service", status_code=status.HTTP_200_OK)
# async def remove_service_from_dist(dist_name: str, service_name: str, token: str = Depends(verify_token)):
#     """ """
#     dream_dist = AssistantDist.from_name(name=dist_name, dream_root=DREAM_ROOT_PATH)
#     dream_dist.remove_service(service_name, inplace=True)
#
#     dream_dist.save(overwrite=True)
#     return _dist_to_distmodel(dream_dist)
