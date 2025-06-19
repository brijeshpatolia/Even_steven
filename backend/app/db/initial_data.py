from sqlalchemy.orm import Session
from app.db import models, session
from app.schemas.group import GroupCreate
from app.schemas.expense import ExpenseCreate
from app.crud import crud_user, crud_group, crud_expense
from app.services import expense_service

def seed_db(db: Session):
    # Check if a group already exists to prevent re-seeding on every server restart
    if db.query(models.Group).first():
        print("Database already contains data. Skipping seeding.")
        return

    print("Seeding database with initial data...")

    # --- Create Users ---
    # get_or_create_user does not commit, so we commit once after adding all users.
    user1 = crud_user.get_or_create_user(db, user_id=101)
    user2 = crud_user.get_or_create_user(db, user_id=102)
    user3 = crud_user.get_or_create_user(db, user_id=103)
    user4 = crud_user.get_or_create_user(db, user_id=104)
    db.commit()
    print("Created users: User 101, User 102, User 103, User 104")

    # --- Create Group 1: "Road Trip" with an equal split ---
    road_trip_group = crud_group.create_group(db, 
        group_in=GroupCreate(name="Road Trip", users=[101, 102, 103])
    )
    print(f"Created group '{road_trip_group.name}'")

    # Add expenses to "Road Trip"
    expenses_road_trip = [
        {"desc": "Gas", "amount": 80.0, "paid_by": 101},
        {"desc": "Snacks", "amount": 45.0, "paid_by": 102},
    ]
    for e in expenses_road_trip:
        expense_in = ExpenseCreate(
            description=e["desc"], amount=e["amount"], paid_by_user_id=e["paid_by"], 
            split_type="equal", splits={}
        )
        expense_obj = crud_expense.create_expense(db, expense_in=expense_in, group_id=road_trip_group.id)
        expense_service.process_expense(db, expense=expense_obj, expense_in=expense_in)
        print(f"  - Added expense: '{e['desc']}'")

    # --- Create Group 2: "Apartment Rent" with a percentage split ---
    apartment_group = crud_group.create_group(db, 
        group_in=GroupCreate(name="Apartment Rent", users=[101, 104])
    )
    print(f"Created group '{apartment_group.name}'")
    
    # Add expenses to "Apartment Rent"
    expense_in_rent = ExpenseCreate(
        description="Monthly Rent", amount=1200.0, paid_by_user_id=101, 
        split_type="percentage", splits={"101": 60, "104": 40} # User 101 pays 60%, User 104 pays 40%
    )
    rent_obj = crud_expense.create_expense(db, expense_in=expense_in_rent, group_id=apartment_group.id)
    expense_service.process_expense(db, expense=rent_obj, expense_in=expense_in_rent)
    print("  - Added expense: 'Monthly Rent'")

    print("\nFinished seeding database.")


def init_db():
    db = session.SessionLocal()
    try:
        # Create tables if they don't exist
        models.Base.metadata.create_all(bind=session.engine)
        # Seed the database with initial data
        seed_db(db)
    finally:
        db.close()