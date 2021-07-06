from typing import Dict, Optional
from pydantic import BaseModel

class CreateResource(BaseModel):
    type: str
    content: object
