# generated by datamodel-codegen:
#   filename:  training.json
#   timestamp: 2021-09-27T13:56:25+00:00

from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel


class Status(Enum):
    RUNNING = 'RUNNING'
    FAILED = 'FAILED'
    SUCCESS = 'SUCCESS'


class Training(BaseModel):
    id: int
    timestamp: datetime
    status: Status
    template_link: str
    trained_model_link: Optional[str] = None
