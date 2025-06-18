

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.schemas.expense import Expense, ExpenseCreate
from app.db.session import get_db

from app.crud import crud_group, crud_expense
from app.services import expense_service
router = APIRouter()

@router.post("/", response_model=Expense)
def create_expense_for_group(
   
    group_name: str,
    *,
    db: Session = Depends(get_db),
    expense_in: ExpenseCreate,
):
    """
    Create a new expense within a specific group, identifying the group by its name.
    """
   
    group = crud_group.get_group_by_name(db, name=group_name)
    if not group:
        raise HTTPException(status_code=404, detail=f"Group '{group_name}' not found")

   
    expense = crud_expense.create_expense(
        db=db, expense_in=expense_in, group_id=group.id
    )
    
    
    expense_service.process_expense(db=db, expense=expense, expense_in=expense_in)
    
    return expense