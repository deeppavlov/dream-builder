from __future__ import annotations

import re
from pathlib import Path
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
        pass

    @classmethod
    @abstractmethod
    def from_data(cls, res: Resources) -> ComponentDataAdapter:
        pass

    @abstractmethod
    def override_configs(self, files: FilesDict) -> FilesDict:
        pass

class StoreDriver(ABC):
    @abstractmethod
    def store(self, path: Path) -> StorePath:
        pass

    @abstractmethod
    def dump(self, path: str, hash: str, target_dir: Path) -> None:
        pass

@dataclass
class ImportedComponent:
    data: Resources
    template_link: str

@dataclass
class StorePath:
    driver: str
    path: str
    hash: str

    @classmethod
    def from_str(cls, str_path: str) -> StorePath:
        match = re.fullmatch(r"(.+)://(.+)@(.+)", str_path)
        if match is None:
            raise ValueError(f"{str_path} is not a valid store path")
        groups = match.groups()
        inst = cls(driver=groups[0], path=groups[1], hash=groups[2])
        return inst

    @classmethod
    def from_path(cls, path: Path) -> StorePath:
        inst = cls(driver="local", path=str(path), hash="na")
        return inst

    def __str__(self) -> str:
        return f"{self.driver}://{self.path}@{self.hash}"

