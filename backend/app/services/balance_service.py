from sqlalchemy.orm import Session
from collections import defaultdict
from decimal import Decimal

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
