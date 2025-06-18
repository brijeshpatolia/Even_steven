
from sqlalchemy.orm import Session
from app.db import models

def get_or_create_user(db: Session, *, user_id: int) -> models.User:
    """
    Retrieves a user by ID. If the user does not exist,
    it creates a new user object and adds it to the session,
    but does NOT commit.
    """
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        
        user = models.User(id=user_id, name=f"User {user_id}")
        db.add(user)
    return user