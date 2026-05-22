from sqlmodel import Session
from database import engine
from models import User, Item

def seed():
    with Session(engine) as session:
        # Cria usuários de teste
        comprador = User(username="luiz_comprador", balance=500.0)
        vendedor = User(username="vendedor_exemplo", balance=100.0)
        
        session.add(comprador)
        session.add(vendedor)
        session.commit()
        session.refresh(comprador)
        session.refresh(vendedor)

        # Cria itens de teste
        item1 = Item(name="Vandal Prime", price=250.0, owner_id=vendedor.id)
        item2 = Item(name="AWP Dragon Lore", price=1000.0, owner_id=vendedor.id)
        
        session.add(item1)
        session.add(item2)
        session.commit()
        print("Banco populado com sucesso!")

if __name__ == "__main__":
    seed()