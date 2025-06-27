from sqlalchemy import Column, Integer, String, Numeric, ForeignKey, Table
from sqlalchemy.orm import relationship
from app.db.session import Base

group_users = Table(
    "group_users",
    Base.metadata,
    Column("group_id", Integer, ForeignKey("groups.id"), primary_key=True),
    Column("user_id", Integer, ForeignKey("users.id"), primary_key=True),
)

class Group(Base):
    __tablename__ = "groups"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)

    expenses = relationship("Expense", back_populates="group")

    members = relationship(
        "User", secondary=group_users, back_populates="groups", lazy="selectin"
    )


class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)
    description = Column(String, index=True)
    amount = Column(Numeric(10, 2))
    
    group_id = Column(Integer, ForeignKey("groups.id"))
    
    paid_by_user_id = Column(Integer, ForeignKey("users.id")) 

    group = relationship("Group", back_populates="expenses")
    
    paid_by = relationship("User", back_populates="expenses_paid")

    splits = relationship("ExpenseSplit", back_populates="expense", cascade="all, delete-orphan")


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, default="Unnamed User") 
    
    groups = relationship(
        "Group", secondary=group_users, back_populates="members"
    )
    
    expenses_paid = relationship("Expense", back_populates="paid_by")


class ExpenseSplit(Base):
    __tablename__ = "expense_splits"
    id = Column(Integer, primary_key=True)
    expense_id = Column(Integer, ForeignKey("expenses.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    amount_owed = Column(Numeric(10, 2))
    expense = relationship("Expense", back_populates="splits")
    user = relationship("User")