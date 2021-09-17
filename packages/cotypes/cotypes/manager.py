from typing import Dict, List, Any
from abc import ABC, abstractmethod

from cotypes.common import Training, Component
from cotypes.adapters import Resources

class ComponentRunner(ABC):
    @abstractmethod
    async def start_training(self, comp: Component, training_hash: str, comp_source: str, data: Resources) -> Training:
        raise NotImplementedError()

    @abstractmethod
    async def interact(self, training_hash: str, msg: List[str]) -> Dict[str, Any]:
        raise NotImplementedError


