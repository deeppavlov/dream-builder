from enum import Enum


class DeploymentState(Enum):
    STARTED = "STARTED"
    CREATING_CONFIG_FILES = "CREATING_CONFIG_FILES"
    BUILDING_IMAGE = "BUILDING_IMAGE"
    PUSHING_IMAGES = "PUSHING_IMAGES"
    DEPLOYING_STACK = "DEPLOYING_STACK"
    DEPLOYED = "DEPLOYED"
    UP = "UP"


class VirtualAssistantPrivateVisibility(Enum):
    PRIVATE = "PRIVATE"
    UNLISTED_LINK = "UNLISTED_LINK"
    UNLISTED_INVITATION = "UNLISTED_INVITATION"


class VirtualAssistantPublicVisibility(Enum):
    PUBLIC_TEMPLATE = "PUBLIC_TEMPLATE"


class PublishRequestState(Enum):
    IN_REVIEW = "IN_REVIEW"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
