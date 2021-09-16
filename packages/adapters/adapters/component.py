import os
from typing import Dict, List, Any
from pathlib import Path
from adapters.registry import get_component_data_adapter
from dataclasses import dataclass

@dataclass
class ImportedComponent:
    type: str
    label: str
    data: Dict[str, List[Dict[str, Any]]]

def _read_files(dir_path: Path):
    files_dict = {}
    for root, _, files in os.walk(dir_path):
        for filename in files:
            abs_path = os.path.join(root, filename)
            file_path = os.path.relpath(abs_path, dir_path)
            with open(abs_path) as f:
                files_dict[file_path] = f.read()
    print(files_dict)
    return files_dict

def import_component(comp_root: Path):
    if "gobot" in comp_root.name:
        Adapter = get_component_data_adapter("gobot", "md")
        files_dict = _read_files(comp_root / 'data')
        component_data = Adapter.import_data(files_dict)
        return ImportedComponent(type="gobot", label=comp_root.name, data=component_data)
