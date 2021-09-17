from __future__ import annotations
from typing import Dict, List, Any
from abc import ABC, abstractmethod
from dataclasses import dataclass

FilesDict = Dict[str, str]
Resources = Dict[str, List[Dict[str, Any]]]
 
class ComponentDataAdapter(ABC):
    files: FilesDict
    data: Resources

    @classmethod
    @abstractmethod
    def from_files(cls, files: FilesDict) -> ComponentDataAdapter:
        raise NotImplementedError("Import is not implemented on this adapter")

    @classmethod
    @abstractmethod
    def from_data(cls, res: Resources) -> ComponentDataAdapter:
        raise NotImplementedError("Export is not implemented on this adapter")

    @abstractmethod
    def override_configs(self, files: FilesDict) -> FilesDict:
        raise NotImplementedError("Config overriding is not implemented on this adapter")

@dataclass
class ImportedComponent:
    type: str
    label: str
    data: Resources

