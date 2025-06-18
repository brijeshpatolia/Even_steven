from sqlalchemy.orm import Session
from fastapi import HTTPException 
from typing import List
from app.db import models
from app.schemas import group as group_schema
from app.crud import crud_user


def get_group_by_name(db: Session, name: str):
    return db.query(models.Group).filter(models.Group.name == name).first()


def create_group(db: Session, *, group_in: group_schema.GroupCreate) -> models.Group:
    db_group_exists = get_group_by_name(db, name=group_in.name)
    if db_group_exists:
        raise HTTPException(
            status_code=400,
            detail="A group with this name already exists.",
        )

    db_group = models.Group(name=group_in.name)

    if group_in.users:
        for user_id in group_in.users:
            user = crud_user.get_or_create_user(db, user_id=user_id)
            db_group.members.append(user)

    db.add(db_group)
    db.commit()
    db.refresh(db_group)
    
    return db_group

def get_groups(db: Session, skip: int = 0, limit: int = 100) -> List[models.Group]:
    return db.query(models.Group).offset(skip).limit(limit).all()


def get_group(db: Session, group_id: int) -> models.Group | None:
    return db.query(models.Group).filter(models.Group.id == group_id).first()
