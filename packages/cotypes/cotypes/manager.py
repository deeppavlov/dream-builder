from typing import List
from abc import ABC, abstractmethod

from cotypes.common import Component, Message 
from cotypes.common.training import Status
from cotypes.adapters import Resources

class ComponentRunner(ABC):
    @abstractmethod
    async def start_training(self, training_hash: str, template_link: str, comp: Component, data: Resources) -> Status:
        """Builds the component and runs a training."""
        raise NotImplementedError()

    @abstractmethod
    async def interact(self, training_hash: str, comp: Component, message_history: List[Message]) -> Message:
        """Sends a message to a trained component and returns the reply."""
        raise NotImplementedError()


