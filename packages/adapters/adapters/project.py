import os
from glob import glob
from typing import List
from pathlib import Path

from cotypes.common import NewComponent
from adapters import import_component
from adapters.registry import get_supported_components


def import_project(root: Path) -> List[NewComponent]:
    comp_types = get_supported_components()
    components: List[NewComponent] = []
    for comp_dir in glob(str(root / "*" / "*") + os.path.sep):
        comp_path = Path(comp_dir)
        for comp_type in comp_types:
            if comp_type in comp_path.name:
                comp = import_component(comp_path, comp_type)
                if comp:
                    components.append(comp)
                break
    return components
