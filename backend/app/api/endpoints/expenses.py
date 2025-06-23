# backend/app/api/endpoints/expenses.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.schemas.expense import Expense, ExpenseCreate
from app.db.session import get_db
from app.crud import crud_group, crud_expense
from app.services import expense_service

router = APIRouter()

@router.post("/", response_model=Expense)
def create_expense_for_group(
    group_id: int,
    *,
    db: Session = Depends(get_db),
    expense_in: ExpenseCreate,
):
    """
    Create a new expense within a specific group, identifying the group by its ID.
    """
    # Fetch group by ID instead of by name
    group = crud_group.get_group(db, group_id=group_id)
    if not group:
        raise HTTPException(status_code=404, detail=f"Group with ID {group_id} not found")

    # VALIDATION: Check if the paying user is a member of the group.
    member_ids = {member.id for member in group.members}
    if expense_in.paid_by_user_id not in member_ids:
        raise HTTPException(
            status_code=400,
            detail=f"User {expense_in.paid_by_user_id} is not a member of the group and cannot pay for an expense."
        )

    expense = crud_expense.create_expense(
        db=db, expense_in=expense_in, group_id=group.id
    )
    
    expense_service.process_expense(db=db, expense=expense, expense_in=expense_in)
    
    return expense