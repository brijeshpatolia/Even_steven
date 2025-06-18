
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.balance import UserBalanceSummary
from app.services import balance_service
from app.crud import crud_user

router = APIRouter()

@router.get("/{user_id}/balances", response_model=UserBalanceSummary)
def read_user_balances(
    user_id: int,
    db: Session = Depends(get_db)
):
    """
    retrieve a summary of a user's balances across all their groups.
    """
    # check if the user exists
    user = crud_user.get_or_create_user(db, user_id=user_id)
    if not user:
         raise HTTPException(status_code=404, detail="User not found")

    summary = balance_service.get_user_overall_balance(db=db, user_id=user_id)
    return summary