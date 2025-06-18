from sqlalchemy.orm import Session
from decimal import Decimal
from fastapi import HTTPException

from app.db import models
from app.schemas import expense as expense_schema
from app.crud import crud_group


def process_expense(
    db: Session, *, expense: models.Expense, expense_in: expense_schema.ExpenseCreate
):
    """
    Processes an expense to create individual split records based on split_type.
    """
    group = crud_group.get_group(db, group_id=expense.group_id)
    if not group:
        raise HTTPException(status_code=404, detail="Group not found during processing")

    members = group.members
    if not members:
        return

    if expense_in.split_type == "equal":
        member_count = len(members)
        owed_share = (Decimal(expense.amount) / Decimal(member_count)).quantize(
            Decimal("0.01")
        )

        for member in members:
            db_split = models.ExpenseSplit(
                expense_id=expense.id, user_id=member.id, amount_owed=owed_share
            )
            db.add(db_split)

    elif expense_in.split_type == "percentage":
        splits = expense_in.splits

        if sum(splits.values()) != 100:
            raise HTTPException(
                status_code=400, detail="Percentages must add up to 100."
            )

        for user_id_str, percentage in splits.items():
            try:
                user_id = int(user_id_str)
            except ValueError:
                raise HTTPException(
                    status_code=400, detail=f"Invalid user ID format: {user_id_str}"
                )
            
            if user_id not in [member.id for member in members]:
                 raise HTTPException(
                    status_code=400, detail=f"User {user_id} is not a member of this group."
                )

            owed_share = (
                Decimal(expense.amount) * (Decimal(percentage) / Decimal(100))
            ).quantize(Decimal("0.01"))

            db_split = models.ExpenseSplit(
                expense_id=expense.id, user_id=user_id, amount_owed=owed_share
            )
            db.add(db_split)

    db.commit()


