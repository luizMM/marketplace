from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from datetime import datetime

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(unique=True, index=True)
    email: str = Field(unique=True, index=True)
    password_hash: str
    balance: float = Field(default=1000.0)
    items: List["Item"] = Relationship(back_populates="owner")

class Item(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    price: float
    game: str = Field(default="CS2")
    rarity: str = Field(default="comum")
    image: str = Field(default="")
    description: str = Field(default="")
    category: str = Field(default="Armas")
    condition: str = Field(default="Factory New")
    owner_id: Optional[int] = Field(default=None, foreign_key="user.id")
    owner: Optional[User] = Relationship(back_populates="items")

class Transaction(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    item_id: int
    item_name: str = Field(default="")
    buyer_id: int
    seller_id: int
    seller_name: str = Field(default="")
    amount: float
    timestamp: datetime = Field(default_factory=datetime.utcnow)
