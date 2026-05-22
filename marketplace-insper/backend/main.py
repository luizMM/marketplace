from fastapi import FastAPI, Depends, HTTPException
from sqlmodel import Session, select
from database import engine, get_session, create_db_and_tables
from models import User, Item, Transaction
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Em produção, troque para o domínio do seu front
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

@app.get("/items")
def get_items(session: Session = Depends(get_session)):
    items = session.exec(select(Item)).all()
    return items

@app.post("/purchase")
def purchase_item(buyer_id: int, item_id: int, session: Session = Depends(get_session)):
    # 1. Buscar itens no banco
    item = session.get(Item, item_id)
    buyer = session.get(User, buyer_id)
    
    if not item or not buyer:
        raise HTTPException(status_code=404, detail="Item ou Usuário não encontrado")
    
    seller = session.get(User, item.owner_id)
    
    # 2. Validações de negócio
    if item.owner_id == buyer_id:
        raise HTTPException(status_code=400, detail="Você já é dono deste item")
    
    if buyer.balance < item.price:
        raise HTTPException(status_code=400, detail="Saldo insuficiente")

    # 3. Execução da transação (Atomicidade)
    # Debita comprador, Credita vendedor, Transfere item
    buyer.balance -= item.price
    seller.balance += item.price
    item.owner_id = buyer.id
    
    # 4. Log da transação
    new_transaction = Transaction(
        item_id=item.id,
        buyer_id=buyer.id,
        seller_id=seller.id,
        amount=item.price
    )
    
    session.add(new_transaction)
    session.add(buyer)
    session.add(seller)
    session.add(item)
    
    session.commit()
    session.refresh(item)
    
    return {"message": "Transação realizada com sucesso", "new_owner": item.owner_id}