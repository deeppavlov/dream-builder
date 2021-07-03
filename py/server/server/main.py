from typing import Dict, Optional

from fastapi import FastAPI
from pydantic import BaseModel

class Data(BaseModel):
    pages: Dict
    resources: Dict

app = FastAPI()

@app.post("/api/res")
def read_item(res):
    print(res)
    return res

