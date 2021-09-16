__version__ = '0.1.0'

from .adapter import ComponentDataAdapter
from .registry import get_component_data_adapter
from .component import import_component, ImportedComponent

from .builtin_adapters import gobot

