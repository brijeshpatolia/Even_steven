from pydantic import BaseModel
from typing import List

class GroupBase(BaseModel):
    name: str

class GroupCreate(GroupBase):
    users: List[int]

class Group(GroupBase):
    id: int

    class Config:
        from_attributes = True






