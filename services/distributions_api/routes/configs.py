from typing import Union
from fastapi import APIRouter, status, exceptions

from const import CONFIGNAME_DREAMOBJECT, DREAM_ROOT_PATH, DreamConfigLiteral, CONFIGNAME_CONFIGOBJECT
from deeppavlov_dreamtools.distconfigs.generics import AnyContainer, PipelineConfService
from deeppavlov_dreamtools.distconfigs.manager import (
    AnyConfig,
    AnyConfigClass,
)

router = APIRouter(prefix="/api/configs")


@router.put("/add_service/", status_code=status.HTTP_201_CREATED)
async def add_new_service(
    config_type: DreamConfigLiteral,
    current_config: AnyConfig,
    name: str,
    new_service: Union[PipelineConfService, AnyContainer],
    service_type: str = None,
):
    """
    Args:
        config_type: Literal["DreamPipeline", "DreamComposeOverride", "DreamComposeDev", "DreamComposeProxy"]
        current_config: config to be changed
        new_service: service to be added
        name: service name
        service_type: optional, service type in pipeline
    """
    # example: config = DreamPipeline(config=current_config)
    config: AnyConfigClass = CONFIGNAME_DREAMOBJECT[config_type](current_config)

    if config_type == "DreamPipeline":
        config.add_service(name=name, service_type=service_type, definition=new_service, inplace=True)
    else:
        config.add_service(name=name, definition=new_service, inplace=True)

    return config


@router.put("/remove_service", status_code=status.HTTP_200_OK)
async def remove_service_from_config(
    config_type: DreamConfigLiteral,
    current_config: AnyConfig,
    name: str,
    service_type: str = None,
):
    """
    Removes the service from current config

    Args:
        config_type: Literal["pipeline_conf", "compose_override", "compose_dev", "compose_proxy"]
        current_config: config to be changed
        new_service: service to be added
        name: service name
        service_type: optional (if config is DreamPipeline), service type in pipeline
    """
    # example: config = DreamPipeline(config=current_config)
    config: AnyConfigClass = CONFIGNAME_DREAMOBJECT[config_type](current_config)

    if config_type == "DreamPipeline":
        config.remove_service(service_type=service_type, name=name, inplace=True)
    else:
        config.remove_service(name=name, inplace=True)

    return config


@router.post(
    "/{dist_name}",
)
async def dump_config_from_dist(config_type: DreamConfigLiteral, dist_name: str):
    """ """
    dream_config = CONFIGNAME_DREAMOBJECT[config_type]
    config_object = CONFIGNAME_CONFIGOBJECT[config_type]

    path_to_dump = DREAM_ROOT_PATH / "assistant_dists" / dist_name / dream_config.DEFAUlT_FILE_NAME
    try:
        dream_config.dump(config_object, path_to_dump, overwrite=True)
    except FileNotFoundError:
        raise exceptions.HTTPException(404, detail="Incorrect name")


@router.get("/{dist_name}")
async def load_config(dist_name: str, config_type: DreamConfigLiteral):
    """
    Loads config with config_type with dist_name
    """
    # example: dream_config = DreamPipeline
    dream_config: AnyConfigClass = CONFIGNAME_DREAMOBJECT[config_type]
    path = DREAM_ROOT_PATH / "assistant_dists" / dist_name / dream_config.DEFAUlT_FILE_NAME

    return dream_config.load(path)
