from pydantic import BaseModel
from typing import Optional


class User(BaseModel):
    id: str
    username: str
    email: str
    password_hash: str
    balance: float


class Item(BaseModel):
    id: str
    name: str
    price: float
    game: str = "CS2"
    rarity: str = "comum"
    image: str = ""
    description: str = ""
    category: str = "Armas"
    condition: str = "Factory New"
    owner_id: Optional[str] = None


class Transaction(BaseModel):
    id: str
    item_id: str
    item_name: str
    buyer_id: str
    seller_id: str
    seller_name: str
    amount: float
    status: str = "pendente"
    timestamp: str
