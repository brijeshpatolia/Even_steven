from pydantic import BaseModel

class Balance(BaseModel):
    ower_id: int
    owee_id: int
    amount: float

    
class UserBalanceSummary(BaseModel):
    total_you_owe: float
    total_you_are_owed: float
    net_balance: float