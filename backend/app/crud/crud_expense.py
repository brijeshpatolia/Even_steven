from sqlalchemy.orm import Session

from app.db import models
from app.schemas import expense as expense_schema

def create_expense(
    db: Session, *, expense_in: expense_schema.ExpenseCreate, group_id: int
) -> models.Expense:
    db_expense = models.Expense(
        description=expense_in.description,
        amount=expense_in.amount,
        group_id=group_id,
        paid_by_user_id=expense_in.paid_by_user_id,
    )

    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)

    return db_expense
