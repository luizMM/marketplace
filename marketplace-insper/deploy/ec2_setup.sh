#!/bin/bash
# Script para rodar na EC2 após conectar via SSH
# Instala dependências e sobe o backend

set -e

echo "=== Atualizando sistema ==="
sudo apt-get update -y
sudo apt-get install -y python3 python3-pip python3-venv git unzip

echo "=== Copiando arquivos do backend ==="
mkdir -p ~/marketplace/backend
cd ~/marketplace/backend

echo "=== Criando ambiente virtual ==="
python3 -m venv venv
source venv/bin/activate

echo "=== Instalando dependências ==="
pip install fastapi==0.115.0 uvicorn==0.30.0 sqlmodel==0.0.21 sqlalchemy==2.0.36 python-dotenv==1.0.1

echo "=== Populando banco de dados ==="
python seed_db.py

echo "=== Iniciando servidor em background ==="
nohup uvicorn main:app --host 0.0.0.0 --port 8000 > ~/uvicorn.log 2>&1 &

echo ""
echo "Backend rodando na porta 8000!"
echo "Verifique com: curl http://localhost:8000/health"
echo "Logs em: ~/uvicorn.log"
