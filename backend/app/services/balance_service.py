from sqlalchemy.orm import Session
from collections import defaultdict
from decimal import Decimal
from app.crud import crud_user
from app.db import models

def get_group_balances(db: Session, *, group_id: int):
    balance_sheet = defaultdict(Decimal)

    group = db.query(models.Group).filter(models.Group.id == group_id).first()
    if not group or not group.members:
        return []

    for expense in group.expenses:
        balance_sheet[expense.paid_by_user_id] += Decimal(expense.amount)
        
        splits = db.query(models.ExpenseSplit).filter(models.ExpenseSplit.expense_id == expense.id).all()
        for split in splits:
            balance_sheet[split.user_id] -= Decimal(split.amount_owed)

    debtors = sorted([(user_id, balance) for user_id, balance in balance_sheet.items() if balance < 0], key=lambda x: x[1])
    creditors = sorted([(user_id, balance) for user_id, balance in balance_sheet.items() if balance > 0], key=lambda x: x[1], reverse=True)
    
    transactions = []
    
    while debtors and creditors:
        debtor_id, debt = debtors[0]
        creditor_id, credit = creditors[0]
        
        amount_to_transfer = min(abs(debt), credit)
        
        transactions.append({
            "ower_id": debtor_id,
            "owee_id": creditor_id,
            "amount": float(amount_to_transfer)
        })
        
        new_debt = debt + amount_to_transfer
        new_credit = credit - amount_to_transfer
        
        if new_debt > -0.01: 
            debtors.pop(0)
        else:
            debtors[0] = (debtor_id, new_debt)
            
        if new_credit < 0.01:
            creditors.pop(0)
        else:
            creditors[0] = (creditor_id, new_credit)
            
    return transactions







def get_user_overall_balance(db: Session, *, user_id: int):
    """
    Calculates a user's total balance across all groups they are a member of.
    """
    user = crud_user.get_or_create_user(db, user_id=user_id)
    if not user:
        return None

    total_owed = Decimal(0)
    total_due = Decimal(0)

    for group in user.groups:
        group_balances = get_group_balances(db=db, group_id=group.id)
        
        for transaction in group_balances:
            if transaction["ower_id"] == user_id:
                total_owed += Decimal(transaction["amount"])
            elif transaction["owee_id"] == user_id:
                total_due += Decimal(transaction["amount"])
    
    net_balance = total_due - total_owed

    return {
        "total_you_owe": float(total_owed),
        "total_you_are_owed": float(total_due),
        "net_balance": float(net_balance)
    }