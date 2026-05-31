import os
import json
import uuid
import hashlib
from decimal import Decimal
from datetime import datetime
from typing import Optional, List

import boto3
from boto3.dynamodb.conditions import Attr
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

REGION = os.getenv("AWS_REGION", "us-east-1")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

dynamodb = boto3.resource('dynamodb', region_name=REGION)
users_table = dynamodb.Table('gamevault-users')
items_table = dynamodb.Table('gamevault-items')
transactions_table = dynamodb.Table('gamevault-transactions')
lambda_client = boto3.client('lambda', region_name=REGION)


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


def to_float(val):
    return float(val) if isinstance(val, Decimal) else val


# ---- Request / Response Models ----

class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: str
    username: str
    email: str
    balance: float

class ItemResponse(BaseModel):
    id: str
    name: str
    price: float
    game: str
    rarity: str
    image: str
    description: str
    category: str
    condition: str
    owner_id: Optional[str]
    seller: str


# ---- Health ----

@app.get("/health")
def health():
    return {"status": "ok"}


# ---- Auth ----

@app.post("/register", response_model=UserResponse)
def register(req: RegisterRequest):
    if users_table.scan(FilterExpression=Attr('email').eq(req.email))['Items']:
        raise HTTPException(status_code=400, detail="Email já cadastrado")
    if users_table.scan(FilterExpression=Attr('username').eq(req.username))['Items']:
        raise HTTPException(status_code=400, detail="Username já em uso")

    new_id = str(uuid.uuid4())
    users_table.put_item(Item={
        'id': new_id,
        'username': req.username,
        'email': req.email,
        'password_hash': hash_password(req.password),
        'balance': Decimal('1000.00'),
    })
    return UserResponse(id=new_id, username=req.username, email=req.email, balance=1000.0)


@app.post("/login", response_model=UserResponse)
def login(req: LoginRequest):
    users = users_table.scan(FilterExpression=Attr('email').eq(req.email))['Items']
    if not users or users[0]['password_hash'] != hash_password(req.password):
        raise HTTPException(status_code=401, detail="Email ou senha incorretos")
    u = users[0]
    return UserResponse(id=u['id'], username=u['username'], email=u['email'], balance=to_float(u['balance']))


# ---- Users ----

@app.get("/users/{user_id}", response_model=UserResponse)
def get_user(user_id: str):
    u = users_table.get_item(Key={'id': str(user_id)}).get('Item')
    if not u:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return UserResponse(id=u['id'], username=u['username'], email=u['email'], balance=to_float(u['balance']))


@app.get("/users/{user_id}/transactions")
def get_user_transactions(user_id: str):
    if not users_table.get_item(Key={'id': str(user_id)}).get('Item'):
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    bought = transactions_table.scan(FilterExpression=Attr('buyer_id').eq(str(user_id)))['Items']
    sold = transactions_table.scan(FilterExpression=Attr('seller_id').eq(str(user_id)))['Items']

    result = []
    for t in bought:
        result.append({
            "id": t['id'], "item_id": t['item_id'], "item_name": t['item_name'],
            "seller_name": t.get('seller_name', ''), "amount": to_float(t['amount']),
            "timestamp": t['timestamp'], "type": "compra", "status": t.get('status', 'concluida'),
        })
    for t in sold:
        result.append({
            "id": t['id'], "item_id": t['item_id'], "item_name": t['item_name'],
            "seller_name": t.get('seller_name', ''), "amount": to_float(t['amount']),
            "timestamp": t['timestamp'], "type": "venda", "status": t.get('status', 'concluida'),
        })

    result.sort(key=lambda x: x["timestamp"], reverse=True)
    return result


# ---- Items ----

def _item_to_response(item: dict) -> ItemResponse:
    owner_id = item.get('owner_id')
    seller_name = ""
    if owner_id:
        owner = users_table.get_item(Key={'id': str(owner_id)}).get('Item')
        seller_name = owner.get('username', '') if owner else ''
    return ItemResponse(
        id=str(item['id']),
        name=item['name'],
        price=to_float(item['price']),
        game=item.get('game', 'CS2'),
        rarity=item.get('rarity', 'comum'),
        image=item.get('image', ''),
        description=item.get('description', ''),
        category=item.get('category', 'Armas'),
        condition=item.get('condition', 'Factory New'),
        owner_id=str(owner_id) if owner_id else None,
        seller=seller_name,
    )


@app.get("/items", response_model=List[ItemResponse])
def get_items():
    return [_item_to_response(i) for i in items_table.scan()['Items']]


@app.get("/items/{item_id}", response_model=ItemResponse)
def get_item(item_id: str):
    item = items_table.get_item(Key={'id': str(item_id)}).get('Item')
    if not item:
        raise HTTPException(status_code=404, detail="Item não encontrado")
    return _item_to_response(item)


# ---- Purchase (assíncrono via Lambda) ----

@app.post("/purchase")
def purchase_item(buyer_id: str, item_id: str):
    item = items_table.get_item(Key={'id': str(item_id)}).get('Item')
    buyer = users_table.get_item(Key={'id': str(buyer_id)}).get('Item')

    if not item or not buyer:
        raise HTTPException(status_code=404, detail="Item ou usuário não encontrado")

    owner_id = item.get('owner_id')
    if str(owner_id) == str(buyer_id):
        raise HTTPException(status_code=400, detail="Você já é dono deste item")
    if not owner_id:
        raise HTTPException(status_code=400, detail="Item sem dono definido")

    seller = users_table.get_item(Key={'id': str(owner_id)}).get('Item')
    if not seller:
        raise HTTPException(status_code=404, detail="Vendedor não encontrado")

    if to_float(buyer['balance']) < to_float(item['price']):
        raise HTTPException(status_code=400, detail="Saldo insuficiente")

    transaction_id = str(uuid.uuid4())
    price = to_float(item['price'])

    # Registra transação pendente
    transactions_table.put_item(Item={
        'id': transaction_id,
        'item_id': str(item['id']),
        'item_name': item['name'],
        'buyer_id': str(buyer_id),
        'seller_id': str(owner_id),
        'seller_name': seller['username'],
        'amount': Decimal(str(price)),
        'status': 'pendente',
        'timestamp': datetime.utcnow().isoformat(),
    })

    # Invoca Lambda de forma assíncrona (fire-and-forget)
    lambda_client.invoke(
        FunctionName='gamevault-processor',
        InvocationType='Event',
        Payload=json.dumps({
            'transaction_id': transaction_id,
            'buyer_id': str(buyer_id),
            'seller_id': str(owner_id),
            'item_id': str(item['id']),
            'amount': price,
        }).encode(),
    )

    return {
        "message": "Transação em processamento",
        "transaction_id": transaction_id,
        "status": "pendente",
    }


# ---- Status da transação ----

@app.get("/transactions/{transaction_id}")
def get_transaction_status(transaction_id: str):
    tx = transactions_table.get_item(Key={'id': transaction_id}).get('Item')
    if not tx:
        raise HTTPException(status_code=404, detail="Transação não encontrada")
    return {
        'id': tx['id'],
        'status': tx['status'],
        'amount': to_float(tx['amount']),
        'item_name': tx.get('item_name', ''),
        'timestamp': tx.get('timestamp', ''),
    }
