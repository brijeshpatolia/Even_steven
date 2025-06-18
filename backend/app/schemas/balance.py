from pydantic import BaseModel

class Balance(BaseModel):
    ower_id: int
    owee_id: int
    amount: float