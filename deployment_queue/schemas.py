from pydantic import BaseModel


class BaseRedisModel(BaseModel):
    pass


class RedisDeployment(BaseRedisModel):
    id: int
