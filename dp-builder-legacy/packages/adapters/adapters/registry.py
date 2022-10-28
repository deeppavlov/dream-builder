from typing import Type, TypeVar, List
from cotypes.adapters import ComponentDataAdapter

_adapters_registry = {}

T = TypeVar('T', Type[ComponentDataAdapter], None)
def register(component_type: str):
    def decorate(cls: T) -> T:
        _adapters_registry[component_type] = cls
        return cls
    return decorate

def get_component_data_adapter(component_type: str) -> Type[ComponentDataAdapter]:
    return _adapters_registry[component_type]

def get_supported_components() -> List[str]:
    return list(_adapters_registry.keys())
