from typing import Type, TypeVar
from collections import defaultdict
from adapters import ComponentDataAdapter

_adapters_registry = defaultdict(dict)

T = TypeVar('T', Type[ComponentDataAdapter], None)
def register(component_type: str, format: str):
    def decorate(cls: T) -> T:
        _adapters_registry[component_type][format] = cls
        return cls
    return decorate

def get_component_data_adapter(component_type: str, format: str) -> Type[ComponentDataAdapter]:
    return _adapters_registry[component_type][format]
