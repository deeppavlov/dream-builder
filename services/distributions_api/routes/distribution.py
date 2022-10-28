from fastapi import APIRouter, status

from services.distributions_api.const import DREAM_ROOT_PATH, DreamConfigLiteral
from services.distributions_api.models import DreamDistConfigsImport, DreamDistModel
from deeppavlov_dreamtools.distconfigs.manager import AnyConfigClass, DreamDist, list_dists


router = APIRouter(prefix="api/assistant_dists")


def _dist_to_distmodel(dream_dist: DreamDist) -> DreamDistModel:
    """
    DreamDist -> DreamDistModel
    """
    return DreamDistModel(
        dist_path=dream_dist.dist_path,
        name=dream_dist.name,
        dream_root=dream_dist.dream_root,
        pipeline_conf=dream_dist.pipeline_conf,
        compose_override=dream_dist.compose_override,
        compose_dev=dream_dist.compose_dev,
        compose_proxy=dream_dist.compose_proxy,
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
        pipeline_conf=dream_dist_model.pipeline_conf,
        compose_override=dream_dist_model.compose_override,
        compose_dev=dream_dist_model.compose_dev,
        compose_proxy=dream_dist_model.compose_proxy,
    )


@router.get("/", status_code=status.HTTP_200_OK)
async def get_list_of_distributions() -> dict[str, DreamDistModel]:
    """
    Returns list of dream distributions in format {name: DreamDistModel}, i.e. {"deepy_adv": DreamDistModel}

    """
    list_of_distributions = list_dists(DREAM_ROOT_PATH)
    distname__distribution = {dist.name: _dist_to_distmodel(dist) for dist in list_of_distributions}

    return distname__distribution


@router.post("/{dist_name}", status_code=status.HTTP_201_CREATED)
async def create_config(dist_name: str, configs: DreamDistConfigsImport):
    """
    Initializes config attribute into dream_dist object. If config is empty it won't be saved in dream distribution

    Args:
        dist_name: name of the distribution
        configs: json with config parameters. Example of json: { "name": name, "data": { "pipeline_conf": ...,
        "override": ..., ...}
    """
    dream_dist = DreamDist.from_name(name=dist_name, dream_root=DREAM_ROOT_PATH)

    for config_name, config_value in configs.data.items():
        if not config_value:
            continue

        # for example, dream_dist.pipeline_conf = config.data.pipeline_conf]
        setattr(dream_dist, config_name, config_value)

    dream_dist.save(overwrite=True)


@router.get("/{dist_name}")
async def get_dist_by_name(dist_name: str) -> DreamDistModel:
    """
    Returns existing dist with the given name

    Args:
        dist_name: name of the distribution

    """
    dream_dist = DreamDist.from_name(name=dist_name, dream_root=DREAM_ROOT_PATH)
    return _dist_to_distmodel(dream_dist)


@router.put("/{dist_name}", status_code=status.HTTP_200_OK)
async def replace_dist(dist_name: str, replacement: DreamDistModel) -> None:
    """
    Replaces distribution dist_name (assistant_dists/dist_name) with the *replacement_dist_name* distribution

    Args:
        dist_name: name of distribution to be replaced
        replacement: replacement DreamDist
    """
    replacement = _distmodel_to_dist(replacement)
    replacement.name = dist_name

    replacement.save(overwrite=True)


@router.get("/{dist_name}/{config_name}")
async def get_config_by_name(dist_name: str, config_name: DreamConfigLiteral) -> AnyConfigClass:
    """
    Returns config (pydantic model)
    """
    dream_dist_obj = DreamDist.from_name(name=dist_name, dream_root=DREAM_ROOT_PATH)
    config: AnyConfigClass = getattr(dream_dist_obj, config_name)
    return config


@router.put("/{dist_name}/{config_name}", status_code=status.HTTP_201_CREATED)
async def replace_config_of_dist(
    dist_name: str, config_name: DreamConfigLiteral, new_config: DreamDistConfigsImport
) -> None:
    """
    Edits distribution with name=dist_name by adding new_config
    """
    dream_dist = DreamDist.from_name(name=dist_name, dream_root=DREAM_ROOT_PATH)

    # Example of logic:
    # dream_dist.pipeline_conf = new_config.data.pipeline_conf  -- dist.pipeline_conf = json.data.pipeline_conf
    setattr(dream_dist, config_name, getattr(new_config.data, config_name))

    dream_dist.save(overwrite=True)


@router.post("/{dist_name}/add_service/", status_code=status.HTTP_201_CREATED)
async def add_service_to_dist(dist_name: str, service_name: str, port: int):
    """ """
    dream_dist = DreamDist.from_name(name=dist_name, dream_root=DREAM_ROOT_PATH)
    dream_dist.add_service(name=service_name, port=port)

    dream_dist.save(overwrite=True)


@router.post("/{dist_name}/remove_service", status_code=status.HTTP_200_OK)
async def remove_service_from_dist(dist_name: str, service_name: str):
    """ """
    dream_dist = DreamDist.from_name(name=dist_name, dream_root=DREAM_ROOT_PATH)
    dream_dist.remove_service(service_name, inplace=True)

    dream_dist.save(overwrite=True)


