# backend/app/api/endpoints/groups.py

from fastapi import APIRouter, Depends, HTTPException 
from sqlalchemy.orm import Session
from typing import List 

from . import expenses
from app.schemas.group import GroupCreate, Group
from app.db.session import get_db
from app.crud import crud_group

router = APIRouter()

@router.post("/")
def create_group(
    *,
    db: Session = Depends(get_db),
    group_in: GroupCreate
):
    """
    Create a new group.
    """
    group = crud_group.create_group(db=db, group_in=group_in)
    return group

@router.get("/", response_model=List[Group])
def read_groups(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100
):
    """
    Retrieve a list of groups with pagination.
    """
    groups = crud_group.get_groups(db, skip=skip, limit=limit)
    return groups

@router.get("/{group_id}", response_model=Group)
def read_group(*, db: Session = Depends(get_db), group_id: int):
    """
    Get a single group by its ID.
    """
    db_group = crud_group.get_group(db, group_id=group_id)
    if db_group is None:
        raise HTTPException(status_code=404, detail="Group not found")
    return db_group

# Use {group_id} which is an integer, instead of {group_name}
router.include_router(expenses.router, prefix="/{group_id}/expenses", tags=["Expenses"])