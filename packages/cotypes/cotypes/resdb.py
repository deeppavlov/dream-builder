from typing import Dict, Any
from pydantic.dataclasses import dataclass

@dataclass
class DBResource:
    resid: str
    type: str
    hash: str
    latest: bool
    timestamp: int
    content: Dict[str, Any]

