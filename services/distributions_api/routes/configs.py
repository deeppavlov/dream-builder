from typing import Union
from fastapi import APIRouter, status, exceptions

from services.distributions_api.const import CONFIG_NAME_OBJECT, DREAM_ROOT_PATH, ConfigClassLiteral, DreamConfigLiteral
from deeppavlov_dreamtools.distconfigs.generics import AnyContainer, PipelineConfService
from deeppavlov_dreamtools.distconfigs.manager import (
    AnyConfig,
    AnyConfigClass,
)

router = APIRouter(prefix="api/configs/")


@router.post("/add_service/", status_code=status.HTTP_201_CREATED)
async def add_new_service(
    config_type: ConfigClassLiteral,
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
    config: AnyConfigClass = CONFIG_NAME_OBJECT[config_type](current_config)

    if config_type == "DreamPipeline":
        config.add_service(name=name, service_type=service_type, definition=new_service, inplace=True)
    else:
        config.add_service(name=name, definition=new_service, inplace=True)

    return config


@router.post("/remove_service", status_code=status.HTTP_200_OK)
async def remove_service_from_config():
    """
    Waiting for merge feat/add_services into main 🙄
    """
    pass


@router.post("/{dist_name}", )
async def dump_config_from_dist(config: AnyConfigClass, dist_name: str):
    """ """
    path_to_dump = DREAM_ROOT_PATH / "assistant_dists" / dist_name / config.DEFAUlT_FILE_NAME
    try:
        config.dump(config, path_to_dump, overwrite=True)
    except FileNotFoundError:
        raise exceptions.HTTPException(404, detail="Incorrect name")


@router.get("/{dist_name}")
async def load_config(dist_name: str, config_type: ConfigClassLiteral):
    """
    Loads config with config_type from distribution with dist_name
    """
    config_object = CONFIG_NAME_OBJECT[config_type]
    path = DREAM_ROOT_PATH / "assistant_dists" / dist_name / config_object.DEFAUlT_FILE_NAME

    return config_object.load(path)
