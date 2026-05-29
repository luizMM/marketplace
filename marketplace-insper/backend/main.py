import os
import hashlib
from fastapi import FastAPI, Depends, HTTPException
from sqlmodel import Session, select
from database import engine, get_session, create_db_and_tables
from models import User, Item, Transaction
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pydantic import BaseModel
from typing import Optional, List

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

# ---- Request / Response Models ----

class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    balance: float

class ItemResponse(BaseModel):
    id: int
    name: str
    price: float
    game: str
    rarity: str
    image: str
    description: str
    category: str
    condition: str
    owner_id: Optional[int]
    seller: str

# ---- Health ----

@app.get("/health")
def health():
    return {"status": "ok"}

# ---- Auth ----

@app.post("/register", response_model=UserResponse)
def register(req: RegisterRequest, session: Session = Depends(get_session)):
    if session.exec(select(User).where(User.email == req.email)).first():
        raise HTTPException(status_code=400, detail="Email já cadastrado")
    if session.exec(select(User).where(User.username == req.username)).first():
        raise HTTPException(status_code=400, detail="Username já em uso")

    user = User(
        username=req.username,
        email=req.email,
        password_hash=hash_password(req.password),
        balance=1000.0,
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    return UserResponse(id=user.id, username=user.username, email=user.email, balance=user.balance)

@app.post("/login", response_model=UserResponse)
def login(req: LoginRequest, session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.email == req.email)).first()
    if not user or user.password_hash != hash_password(req.password):
        raise HTTPException(status_code=401, detail="Email ou senha incorretos")
    return UserResponse(id=user.id, username=user.username, email=user.email, balance=user.balance)

# ---- Users ----

@app.get("/users/{user_id}", response_model=UserResponse)
def get_user(user_id: int, session: Session = Depends(get_session)):
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return UserResponse(id=user.id, username=user.username, email=user.email, balance=user.balance)

@app.get("/users/{user_id}/transactions")
def get_user_transactions(user_id: int, session: Session = Depends(get_session)):
    if not session.get(User, user_id):
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    bought = session.exec(select(Transaction).where(Transaction.buyer_id == user_id)).all()
    sold = session.exec(select(Transaction).where(Transaction.seller_id == user_id)).all()

    result = []
    for t in bought:
        result.append({
            "id": t.id,
            "item_id": t.item_id,
            "item_name": t.item_name,
            "seller_name": t.seller_name,
            "amount": t.amount,
            "timestamp": t.timestamp.isoformat(),
            "type": "compra",
            "status": "concluida",
        })
    for t in sold:
        result.append({
            "id": t.id,
            "item_id": t.item_id,
            "item_name": t.item_name,
            "seller_name": t.seller_name,
            "amount": t.amount,
            "timestamp": t.timestamp.isoformat(),
            "type": "venda",
            "status": "concluida",
        })

    result.sort(key=lambda x: x["timestamp"], reverse=True)
    return result

# ---- Items ----

def _item_to_response(item: Item, session: Session) -> ItemResponse:
    seller_name = ""
    if item.owner_id:
        owner = session.get(User, item.owner_id)
        seller_name = owner.username if owner else ""
    return ItemResponse(
        id=item.id,
        name=item.name,
        price=item.price,
        game=item.game,
        rarity=item.rarity,
        image=item.image,
        description=item.description,
        category=item.category,
        condition=item.condition,
        owner_id=item.owner_id,
        seller=seller_name,
    )

@app.get("/items", response_model=List[ItemResponse])
def get_items(session: Session = Depends(get_session)):
    items = session.exec(select(Item)).all()
    return [_item_to_response(i, session) for i in items]

@app.get("/items/{item_id}", response_model=ItemResponse)
def get_item(item_id: int, session: Session = Depends(get_session)):
    item = session.get(Item, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item não encontrado")
    return _item_to_response(item, session)

# ---- Purchase ----

@app.post("/purchase")
def purchase_item(buyer_id: int, item_id: int, session: Session = Depends(get_session)):
    item = session.get(Item, item_id)
    buyer = session.get(User, buyer_id)

    if not item or not buyer:
        raise HTTPException(status_code=404, detail="Item ou Usuário não encontrado")

    if item.owner_id == buyer_id:
        raise HTTPException(status_code=400, detail="Você já é dono deste item")

    if not item.owner_id:
        raise HTTPException(status_code=400, detail="Item sem dono definido")

    seller = session.get(User, item.owner_id)
    if not seller:
        raise HTTPException(status_code=404, detail="Vendedor não encontrado")

    if buyer.balance < item.price:
        raise HTTPException(status_code=400, detail="Saldo insuficiente")

    buyer.balance -= item.price
    seller.balance += item.price

    transaction = Transaction(
        item_id=item.id,
        item_name=item.name,
        buyer_id=buyer.id,
        seller_id=seller.id,
        seller_name=seller.username,
        amount=item.price,
    )

    item.owner_id = buyer.id

    session.add(transaction)
    session.add(buyer)
    session.add(seller)
    session.add(item)
    session.commit()
    session.refresh(buyer)

    return {
        "message": "Transação realizada com sucesso",
        "new_owner_id": item.owner_id,
        "new_balance": buyer.balance,
    }
