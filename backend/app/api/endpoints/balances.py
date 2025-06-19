# backend/app/api/endpoints/balances.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.schemas.balance import Balance
from app.services import balance_service
from app.crud import crud_group

router = APIRouter()

@router.get("/group/{group_id}", response_model=List[Balance])
def read_group_balances(
    group_id: int,
    db: Session = Depends(get_db)
):
    """
    Retrieve simplified balances for a specific group by ID.
    """
    # Fetch group by ID
    group = crud_group.get_group(db, group_id=group_id)
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")
        
    balances = balance_service.get_group_balances(db=db, group_id=group.id)
    return balances