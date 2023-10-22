from pathlib import Path
from typing import Union

from deeppavlov_dreamtools.distconfigs import generics
from deeppavlov_dreamtools.distconfigs.services import _resolve_default_service_config_paths, DreamService


def create_google_api_skill_service(
    dream_root: Union[Path, str],
    config_dir: Union[Path, str],
    service_name: str,
    service_port: int,
):
    source_dir, config_dir, service_file, environment_file = _resolve_default_service_config_paths(
        config_dir=config_dir
    )
    service = DreamService(
        dream_root,
        source_dir,
        config_dir,
        service_file,
        environment_file,
        service=generics.Service(
            name=service_name,
            endpoints=["respond"],
            compose=generics.ComposeContainer(
                env_file=[".env"],
                build=generics.ContainerBuildDefinition(
                    context=".", dockerfile="./skills/dff_google_api_skill/Dockerfile"
                ),
                deploy=generics.DeploymentDefinition(
                    resources=generics.DeploymentDefinitionResources(
                        limits=generics.DeploymentDefinitionResourcesArg(memory="128M"),
                        reservations=generics.DeploymentDefinitionResourcesArg(memory="128M"),
                    )
                ),
                volumes=["./skills/dff_google_api_skill:/src", "./common:/src/common"],
            ),
        ),
        environment={
            "SERVICE_PORT": service_port,
            "SERVICE_NAME": service_name,
            "ENVVARS_TO_SEND": "OPENAI_API_KEY, GOOGLE_CSE_ID, GOOGLE_API_KEY",
        },
    )

    service.save_configs()

    return service