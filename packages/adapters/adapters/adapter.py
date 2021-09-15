from typing import Dict, Any, List
from abc import ABC, abstractmethod

FilesDict = Dict[str, str]
Resources = Dict[str, List[Dict[str, Any]]]
 
class ComponentDataAdapter(ABC):
    @staticmethod
    @abstractmethod
    def import_data(files: FilesDict) -> Resources:
        raise NotImplementedError("Import is not implemented on this adapter")

    @staticmethod
    @abstractmethod
    def export_data(res: Resources) -> FilesDict:
        raise NotImplementedError("Export is not implemented on this adapter")

