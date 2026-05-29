"""
Run this script once to populate the database with test data.
It deletes the existing SQLite file and recreates everything.
Usage: python seed_db.py
"""
import os
import hashlib

db_path = "marketplace.db"
if os.path.exists(db_path):
    os.remove(db_path)
    print(f"Removed existing {db_path}")

from database import engine, create_db_and_tables
from models import User, Item
from sqlmodel import Session

create_db_and_tables()

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

with Session(engine) as session:
    seller1 = User(username="ProTrader", email="protrader@email.com",
                   password_hash=hash_password("123456"), balance=5000.0)
    seller2 = User(username="SkinMaster", email="skinmaster@email.com",
                   password_hash=hash_password("123456"), balance=3000.0)
    buyer   = User(username="jogador123", email="jogador@email.com",
                   password_hash=hash_password("123456"), balance=2000.0)

    session.add_all([seller1, seller2, buyer])
    session.commit()
    session.refresh(seller1)
    session.refresh(seller2)
    session.refresh(buyer)

    items = [
        Item(name="Dragon Lore AWP", price=8500.0, game="CS2", rarity="lendario",
             image="https://images.unsplash.com/photo-1614294148960-9aa740632a87?w=400&h=400&fit=crop",
             description="A lendária skin Dragon Lore para AWP. Uma das skins mais raras e desejadas do CS2.",
             category="Armas", condition="Factory New", owner_id=seller1.id),
        Item(name="Reaver Vandal", price=450.0, game="Valorant", rarity="epico",
             image="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=400&fit=crop",
             description="Skin Reaver para Vandal com efeitos visuais e sonoros exclusivos.",
             category="Armas", condition="Novo", owner_id=seller2.id),
        Item(name="Renegade Raider", price=1200.0, game="Fortnite", rarity="lendario",
             image="https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?w=400&h=400&fit=crop",
             description="Skin Renegade Raider da Temporada 1 do Fortnite. Uma das skins mais raras do jogo.",
             category="Personagens", condition="Conta Completa", owner_id=seller1.id),
        Item(name="Karambit Fade", price=3200.0, game="CS2", rarity="epico",
             image="https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&h=400&fit=crop",
             description="Karambit com acabamento Fade perfeito. Gradiente de cores vibrantes.",
             category="Armas", condition="Factory New", owner_id=seller2.id),
        Item(name="M4A4 Howl", price=4500.0, game="CS2", rarity="lendario",
             image="https://images.unsplash.com/photo-1552820728-8b83bb6b2b0d?w=400&h=400&fit=crop",
             description="A icônica M4A4 Howl, a única skin contrabandeada do CS2.",
             category="Armas", condition="Minimal Wear", owner_id=seller1.id),
        Item(name="Phantom Oni", price=320.0, game="Valorant", rarity="raro",
             image="https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=400&fit=crop",
             description="Skin Oni para Phantom com tema japonês.",
             category="Armas", condition="Novo", owner_id=seller2.id),
        Item(name="Galaxy Skin", price=890.0, game="Fortnite", rarity="epico",
             image="https://images.unsplash.com/photo-1493711662062-fa541f7f3d24?w=400&h=400&fit=crop",
             description="Skin Galaxy exclusiva do Fortnite com aparência cósmica.",
             category="Personagens", condition="Conta Completa", owner_id=seller1.id),
        Item(name="Sport Gloves Pandora", price=1800.0, game="CS2", rarity="raro",
             image="https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=400&h=400&fit=crop",
             description="Sport Gloves com padrão Pandora Box. Design roxo e azul elegante.",
             category="Acessorios", condition="Field-Tested", owner_id=seller2.id),
        Item(name="AK-47 Fire Serpent", price=2100.0, game="CS2", rarity="epico",
             image="https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&h=400&fit=crop",
             description="AK-47 Fire Serpent com design de serpente de fogo.",
             category="Armas", condition="Minimal Wear", owner_id=seller1.id),
        Item(name="Prime Vandal", price=380.0, game="Valorant", rarity="epico",
             image="https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=400&fit=crop",
             description="Skin Prime para Vandal com design futurista.",
             category="Armas", condition="Novo", owner_id=seller2.id),
        Item(name="Black Knight", price=950.0, game="Fortnite", rarity="lendario",
             image="https://images.unsplash.com/photo-1518908336710-4e1cf821d3d1?w=400&h=400&fit=crop",
             description="Skin Black Knight da Temporada 2 do Fortnite.",
             category="Personagens", condition="Conta Completa", owner_id=seller1.id),
        Item(name="Butterfly Knife Doppler", price=2800.0, game="CS2", rarity="epico",
             image="https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=400&fit=crop",
             description="Butterfly Knife com acabamento Doppler Phase 2.",
             category="Armas", condition="Factory New", owner_id=seller2.id),
    ]

    session.add_all(items)
    session.commit()

print("Banco de dados populado com sucesso!")
print("Usuarios criados:")
print("  jogador@email.com  / senha: 123456  (saldo: R$ 2000)")
print("  protrader@email.com / senha: 123456  (saldo: R$ 5000)")
print("  skinmaster@email.com / senha: 123456 (saldo: R$ 3000)")
