# generated by datamodel-codegen:
#   filename:  project.json
#   timestamp: 2021-10-03T17:23:34+00:00

from __future__ import annotations

from pydantic import BaseModel


class Project(BaseModel):
    name: str
    export_root: str
