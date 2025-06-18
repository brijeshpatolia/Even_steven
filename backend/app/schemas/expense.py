from pydantic import BaseModel
from typing import Dict

class ExpenseBase(BaseModel):
    description: str
    amount: float

class ExpenseCreate(ExpenseBase):
    paid_by_user_id: int
    split_type: str 
    splits: Dict

class Expense(ExpenseBase):
    id: int
    group_id: int
    paid_by_user_id: int

    class Config:
        from_attributes = True