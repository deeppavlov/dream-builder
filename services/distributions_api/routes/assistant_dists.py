from datetime import datetime
from typing import List

from deeppavlov_dreamtools.distconfigs.generics import Component
from fastapi import APIRouter, status, Depends

from deeppavlov_dreamtools.distconfigs.manager import AnyConfigClass, DreamDist, list_dists
from deeppavlov_dreamtools.distconfigs.manager import (
    DreamComposeDev,
    DreamComposeOverride,
    DreamComposeProxy,
    DreamPipeline,
)

from services.distributions_api.const import DREAM_ROOT_PATH, DreamConfigLiteral
from services.distributions_api.models import (
    DreamDistConfigsImport,
    DreamDistModel,
    DreamDistModelShort,
    DreamDistModelMetadata,
    ComponentShort,
)
from services.distributions_api.security.auth import verify_token

assistant_dists_router = APIRouter(prefix="/api/assistant_dists")


def _dist_to_distmodel_short(dream_dist: DreamDist) -> DreamDistModelShort:
    """
    DreamDist -> DreamDistModelShort
    """
    return DreamDistModelShort(
        name=dream_dist.name,
        **dream_dist.pipeline_conf.config.metadata.dict(),
    )


def _dist_to_distmodel(dream_dist: DreamDist) -> DreamDistModel:
    """
    DreamDist -> DreamDistModel
    """
    return DreamDistModel(
        dist_path=str(dream_dist.dist_path),
        name=dream_dist.name,
        dream_root=str(dream_dist.dream_root),
        pipeline_conf=dream_dist.pipeline_conf.config if dream_dist.pipeline_conf else None,
        compose_override=dream_dist.compose_override.config if dream_dist.compose_override else None,
        compose_dev=dream_dist.compose_dev.config if dream_dist.compose_dev else None,
        compose_proxy=dream_dist.compose_proxy.config if dream_dist.compose_proxy else None,
    )


def _distmodel_to_dist(dream_dist_model: DreamDistModel) -> DreamDist:
    """
    Pydantic model to python object
    DreamDistModel -> DreamDist
    """
    return DreamDist(
        dist_path=dream_dist_model.dist_path,
        name=dream_dist_model.name,
        dream_root=dream_dist_model.dream_root,
        pipeline_conf=DreamPipeline(dream_dist_model.pipeline_conf),
        compose_override=DreamComposeOverride(dream_dist_model.compose_override),
        compose_dev=DreamComposeDev(dream_dist_model.compose_dev),
        compose_proxy=DreamComposeProxy(dream_dist_model.compose_proxy),
    )


def _component_to_component_short(component: Component) -> ComponentShort:
    return ComponentShort(name=component.name, **component.metadata.dict())


@assistant_dists_router.get("/", status_code=status.HTTP_200_OK)
async def get_list_of_distributions() -> List[DreamDistModelShort]:
    """
    Returns list of dream distributions in format {name: DreamDistModel}, i.e. {"deepy_adv": DreamDistModel}

    Very expensive endpoint. Run it carefully.
    """
    distributions = list_dists(DREAM_ROOT_PATH)
    distributions = [_dist_to_distmodel_short(dist) for dist in distributions]

    return distributions


@assistant_dists_router.get("/{dist_name}")
async def get_dist_by_name(dist_name: str, token: str = Depends(verify_token)) -> DreamDistModel:
    """
    Returns existing dist with the given name

    Args:
        dist_name: name of the distribution
        token: jwt token

    """
    dream_dist = DreamDist.from_name(name=dist_name, dream_root=DREAM_ROOT_PATH)
    return _dist_to_distmodel(dream_dist)


@assistant_dists_router.put("/{dist_name}", status_code=status.HTTP_200_OK)
async def replace_dist(dist_name: str, replacement: DreamDistModel, token: str = Depends(verify_token)) -> None:
    """
    Replaces distribution dist_name (assistant_dists/dist_name) with the *replacement_dist_name* distribution

    Args:
        dist_name: name of distribution to be replaced
        replacement: replacement DreamDist
        token:
    """
    replacement = _distmodel_to_dist(replacement)
    replacement.name = dist_name

    replacement.save(overwrite=True)
    return _dist_to_distmodel(replacement)


@assistant_dists_router.post("/{dist_name}", status_code=status.HTTP_201_CREATED)
async def create_config(dist_name: str, configs: DreamDistConfigsImport, token: str = Depends(verify_token)):
    """
    Initializes config attribute into dream_dist object. If config is empty it won't be saved in dream distribution

    Args:
        dist_name: name of the distribution
        configs: json with config parameters. Example of json: { "name": name, "data": { "pipeline_conf": ...,
        "override": ..., ...}
        token:
    """
    dream_dist = DreamDist.from_name(name=dist_name, dream_root=DREAM_ROOT_PATH)

    for config_name, config_value in configs.data.items():
        if not config_value:
            continue

        # for example, dream_dist.pipeline_conf = config.data.pipeline_conf
        setattr(dream_dist, config_name, config_value)

    dream_dist.save(overwrite=True)
    return _dist_to_distmodel(dream_dist)


@assistant_dists_router.get("/{dist_name}/{config_name}")
async def get_config_by_name(
    dist_name: str, config_name: DreamConfigLiteral, token: str = Depends(verify_token)
) -> AnyConfigClass:
    """
    Returns config (pydantic model)
    """
    dream_dist_obj = DreamDist.from_name(name=dist_name, dream_root=DREAM_ROOT_PATH)
    config: AnyConfigClass = getattr(dream_dist_obj, config_name)
    return config


@assistant_dists_router.put("/{dist_name}/{config_name}", status_code=status.HTTP_201_CREATED)
async def replace_config_of_dist(
    dist_name: str,
    config_name: DreamConfigLiteral,
    new_config: DreamDistConfigsImport,
    token: str = Depends(verify_token),
):
    """
    Edits distribution with name=dist_name by adding new_config
    """
    dream_dist = DreamDist.from_name(name=dist_name, dream_root=DREAM_ROOT_PATH)

    # Example of logic:
    # dream_dist.pipeline_conf = new_config.data.pipeline_conf  -- dist.pipeline_conf = json.data.pipeline_conf
    setattr(dream_dist, config_name, getattr(new_config.data, config_name))

    dream_dist.save(overwrite=True)
    return _dist_to_distmodel(dream_dist)


@assistant_dists_router.get("/{dist_name}/components/")
async def get_config_services_by_group(dist_name: str, token: str = Depends(verify_token)):
    dist = DreamDist.from_name(name=dist_name, dream_root=DREAM_ROOT_PATH)

    all_components = {}

    groups = [
        "annotators",
        "skill_selectors",
        "skills",
        "candidate_annotators",
        "response_selectors",
        "response_annotators",
    ]
    for component_group in groups:
        components = []

        for component in dist.iter_components(component_group):
            components.append(_component_to_component_short(component))

        all_components[component_group] = components

    return all_components


@assistant_dists_router.get("/{dist_name}/components/{component_group}")
async def get_config_services_by_group(dist_name: str, component_group: str, token: str = Depends(verify_token)):
    dist = DreamDist.from_name(name=dist_name, dream_root=DREAM_ROOT_PATH)
    return list(_component_to_component_short(c) for c in dist.iter_components(component_group))


@assistant_dists_router.post("/{dist_name}/add_service/", status_code=status.HTTP_201_CREATED)
async def add_service_to_dist(dist_name: str, service_name: str, port: int, token: str = Depends(verify_token)):
    """ """
    dream_dist = DreamDist.from_name(name=dist_name, dream_root=DREAM_ROOT_PATH)
    dream_dist.add_service(name=service_name, port=port)

    dream_dist.save(overwrite=True)
    return _dist_to_distmodel(dream_dist)


@assistant_dists_router.post("/{dist_name}/remove_service", status_code=status.HTTP_200_OK)
async def remove_service_from_dist(dist_name: str, service_name: str, token: str = Depends(verify_token)):
    """ """
    dream_dist = DreamDist.from_name(name=dist_name, dream_root=DREAM_ROOT_PATH)
    dream_dist.remove_service(service_name, inplace=True)

    dream_dist.save(overwrite=True)
    return _dist_to_distmodel(dream_dist)
