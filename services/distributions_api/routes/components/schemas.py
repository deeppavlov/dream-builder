from enum import Enum


class ComponentCreationStatus(str, Enum):
    NEW = "new"
    ASSISTANT_CLONE = "assistant_clone"
    COMPONENT_CLONE = "component_clone"
