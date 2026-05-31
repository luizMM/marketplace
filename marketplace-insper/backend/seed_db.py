"""
Popula as tabelas DynamoDB com dados de teste.
Execute após criar as tabelas com setup_aws.py
Usage: python seed_db.py
"""
import boto3
import hashlib
import os
from decimal import Decimal
from dotenv import load_dotenv

load_dotenv()

REGION = os.getenv("AWS_REGION", "us-east-1")
dynamodb = boto3.resource('dynamodb', region_name=REGION)

users_table = dynamodb.Table('gamevault-users')
items_table = dynamodb.Table('gamevault-items')
transactions_table = dynamodb.Table('gamevault-transactions')


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


print("Limpando tabelas...")
for item in users_table.scan()['Items']:
    users_table.delete_item(Key={'id': item['id']})
for item in items_table.scan()['Items']:
    items_table.delete_item(Key={'id': item['id']})
for item in transactions_table.scan()['Items']:
    transactions_table.delete_item(Key={'id': item['id']})

print("Criando usuários...")
users = [
    {'id': '1', 'username': 'ProTrader',  'email': 'protrader@email.com',
     'password_hash': hash_password('123456'), 'balance': Decimal('5000.00')},
    {'id': '2', 'username': 'SkinMaster', 'email': 'skinmaster@email.com',
     'password_hash': hash_password('123456'), 'balance': Decimal('3000.00')},
    {'id': '3', 'username': 'jogador123', 'email': 'jogador@email.com',
     'password_hash': hash_password('123456'), 'balance': Decimal('2000.00')},
]
for u in users:
    users_table.put_item(Item=u)

print("Criando itens...")
items_data = [
    {'id': '1',  'name': 'Dragon Lore AWP',        'price': Decimal('8500.00'), 'game': 'CS2',      'rarity': 'lendario',
     'image': 'https://images.unsplash.com/photo-1614294148960-9aa740632a87?w=400&h=400&fit=crop',
     'description': 'A lendária skin Dragon Lore para AWP. Uma das skins mais raras do CS2.',
     'category': 'Armas',       'condition': 'Factory New',      'owner_id': '1'},
    {'id': '2',  'name': 'Reaver Vandal',           'price': Decimal('450.00'),  'game': 'Valorant', 'rarity': 'epico',
     'image': 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=400&fit=crop',
     'description': 'Skin Reaver para Vandal com efeitos visuais e sonoros exclusivos.',
     'category': 'Armas',       'condition': 'Novo',             'owner_id': '2'},
    {'id': '3',  'name': 'Renegade Raider',         'price': Decimal('1200.00'), 'game': 'Fortnite', 'rarity': 'lendario',
     'image': 'https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?w=400&h=400&fit=crop',
     'description': 'Skin Renegade Raider da Temporada 1 do Fortnite.',
     'category': 'Personagens', 'condition': 'Conta Completa',   'owner_id': '1'},
    {'id': '4',  'name': 'Karambit Fade',           'price': Decimal('3200.00'), 'game': 'CS2',      'rarity': 'epico',
     'image': 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&h=400&fit=crop',
     'description': 'Karambit com acabamento Fade perfeito. Gradiente de cores vibrantes.',
     'category': 'Armas',       'condition': 'Factory New',      'owner_id': '2'},
    {'id': '5',  'name': 'M4A4 Howl',               'price': Decimal('4500.00'), 'game': 'CS2',      'rarity': 'lendario',
     'image': 'https://images.unsplash.com/photo-1552820728-8b83bb6b2b0d?w=400&h=400&fit=crop',
     'description': 'A icônica M4A4 Howl, a única skin contrabandeada do CS2.',
     'category': 'Armas',       'condition': 'Minimal Wear',     'owner_id': '1'},
    {'id': '6',  'name': 'Phantom Oni',             'price': Decimal('320.00'),  'game': 'Valorant', 'rarity': 'raro',
     'image': 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=400&fit=crop',
     'description': 'Skin Oni para Phantom com tema japonês.',
     'category': 'Armas',       'condition': 'Novo',             'owner_id': '2'},
    {'id': '7',  'name': 'Galaxy Skin',             'price': Decimal('890.00'),  'game': 'Fortnite', 'rarity': 'epico',
     'image': 'https://images.unsplash.com/photo-1493711662062-fa541f7f3d24?w=400&h=400&fit=crop',
     'description': 'Skin Galaxy exclusiva do Fortnite com aparência cósmica.',
     'category': 'Personagens', 'condition': 'Conta Completa',   'owner_id': '1'},
    {'id': '8',  'name': 'Sport Gloves Pandora',    'price': Decimal('1800.00'), 'game': 'CS2',      'rarity': 'raro',
     'image': 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=400&h=400&fit=crop',
     'description': 'Sport Gloves com padrão Pandora Box. Design roxo e azul.',
     'category': 'Acessorios',  'condition': 'Field-Tested',     'owner_id': '2'},
    {'id': '9',  'name': 'AK-47 Fire Serpent',      'price': Decimal('2100.00'), 'game': 'CS2',      'rarity': 'epico',
     'image': 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&h=400&fit=crop',
     'description': 'AK-47 Fire Serpent com design de serpente de fogo.',
     'category': 'Armas',       'condition': 'Minimal Wear',     'owner_id': '1'},
    {'id': '10', 'name': 'Prime Vandal',            'price': Decimal('380.00'),  'game': 'Valorant', 'rarity': 'epico',
     'image': 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=400&fit=crop',
     'description': 'Skin Prime para Vandal com design futurista.',
     'category': 'Armas',       'condition': 'Novo',             'owner_id': '2'},
    {'id': '11', 'name': 'Black Knight',            'price': Decimal('950.00'),  'game': 'Fortnite', 'rarity': 'lendario',
     'image': 'https://images.unsplash.com/photo-1518908336710-4e1cf821d3d1?w=400&h=400&fit=crop',
     'description': 'Skin Black Knight da Temporada 2 do Fortnite.',
     'category': 'Personagens', 'condition': 'Conta Completa',   'owner_id': '1'},
    {'id': '12', 'name': 'Butterfly Knife Doppler', 'price': Decimal('2800.00'), 'game': 'CS2',      'rarity': 'epico',
     'image': 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=400&fit=crop',
     'description': 'Butterfly Knife com acabamento Doppler Phase 2.',
     'category': 'Armas',       'condition': 'Factory New',      'owner_id': '2'},
]
for i in items_data:
    items_table.put_item(Item=i)

print("\nBanco de dados populado com sucesso!")
print("Usuários:")
print("  jogador@email.com   / 123456  (saldo: R$ 2000)")
print("  protrader@email.com / 123456  (saldo: R$ 5000)")
print("  skinmaster@email.com / 123456 (saldo: R$ 3000)")
