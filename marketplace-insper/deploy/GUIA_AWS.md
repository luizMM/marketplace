# Guia de Deploy AWS — GameVault Marketplace

## Visão Geral

```
[Usuário] → S3 (Frontend React) → EC2 :8000 (Backend FastAPI) → SQLite
```

---

## PASSO 1 — Instalar AWS CLI

1. Baixe e instale: https://awscli.amazonaws.com/AWSCLIV2.msi
2. Após instalar, feche e reabra o terminal PowerShell
3. Teste: `aws --version`

---

## PASSO 2 — Credenciais AWS Academy

1. Acesse o portal do AWS Academy
2. Abra o **Learner Lab** e clique em **Start Lab** (aguarde ficar verde)
3. Clique em **AWS Details** → **AWS CLI**
4. Copie o bloco com `aws_access_key_id`, `aws_secret_access_key`, `aws_session_token`
5. No PowerShell, cole e execute as 3 variáveis:
   ```powershell
   $env:AWS_ACCESS_KEY_ID     = "ASIA..."
   $env:AWS_SECRET_ACCESS_KEY = "..."
   $env:AWS_SESSION_TOKEN     = "..."
   $env:AWS_DEFAULT_REGION    = "us-east-1"
   ```
6. Teste: `aws sts get-caller-identity` (deve retornar seu usuário)

---

## PASSO 3 — Criar EC2 para o Backend

### 3.1 No console AWS (console.aws.amazon.com):

1. Vá em **EC2** → **Launch Instance**
2. Configure:
   - **Nome**: `gamevault-backend`
   - **AMI**: Ubuntu Server 22.04 LTS (Free tier eligible)
   - **Instance type**: `t2.micro` (free tier)
   - **Key pair**: crie um novo chamado `gamevault-key` e **baixe o .pem**
   - **Security Group**: crie novo com as regras:
     - SSH (porta 22) — Source: My IP
     - Custom TCP (porta 8000) — Source: 0.0.0.0/0
     - HTTP (porta 80) — Source: 0.0.0.0/0
3. Clique em **Launch Instance**
4. Anote o **Public IPv4 address** da instância (ex: `54.123.45.67`)

### 3.2 Mova o arquivo .pem para pasta segura:
```powershell
Move-Item ~\Downloads\gamevault-key.pem ~\gamevault-key.pem
icacls ~\gamevault-key.pem /inheritance:r /grant:r "$env:USERNAME`:R"
```

---

## PASSO 4 — Enviar e configurar o Backend na EC2

### 4.1 Empacotar o backend:
```powershell
cd C:\Users\lujiq\Downloads\marketplace\marketplace-insper\deploy
.\pack_backend.ps1
```

### 4.2 Enviar para a EC2 (substitua SEU_IP_EC2):
```powershell
scp -i ~\gamevault-key.pem deploy\backend.zip ubuntu@SEU_IP_EC2:~/
```

### 4.3 Conectar via SSH:
```powershell
ssh -i ~\gamevault-key.pem ubuntu@SEU_IP_EC2
```

### 4.4 Na EC2, configurar e subir o backend:
```bash
# Descompactar
mkdir -p ~/marketplace/backend
unzip ~/backend.zip -d ~/marketplace/backend
cd ~/marketplace/backend

# Instalar Python e dependências
sudo apt-get update -y
sudo apt-get install -y python3 python3-pip python3-venv unzip

python3 -m venv venv
source venv/bin/activate
pip install fastapi==0.115.0 uvicorn==0.30.0 sqlmodel==0.0.21 sqlalchemy==2.0.36 python-dotenv==1.0.1

# Configurar .env
echo "DATABASE_URL=sqlite:///marketplace.db" > .env

# Popular banco de dados
python seed_db.py

# Subir o servidor (em background)
nohup uvicorn main:app --host 0.0.0.0 --port 8000 > ~/uvicorn.log 2>&1 &

# Testar
curl http://localhost:8000/health
curl http://localhost:8000/items
```

### 4.5 Testar de fora (no seu PC):
```powershell
curl http://SEU_IP_EC2:8000/health
```
Deve retornar: `{"status":"ok"}`

---

## PASSO 5 — Deploy do Frontend no S3

No PowerShell do seu PC (com as credenciais AWS configuradas):

```powershell
cd C:\Users\lujiq\Downloads\marketplace\marketplace-insper\deploy

.\deploy_frontend.ps1 -EC2_IP "SEU_IP_EC2" -BUCKET_NAME "gamevault-marketplace-2026"
```

**Obs**: O nome do bucket deve ser único globalmente. Se der erro, mude o nome.

Ao final, o script imprime a URL do frontend, algo como:
```
http://gamevault-marketplace-2026.s3-website-us-east-1.amazonaws.com
```

---

## PASSO 6 — Verificar que tudo funciona

1. Abra a URL do S3 no navegador
2. Faça login com: `jogador@email.com` / `123456`
3. Navegue ao Marketplace — deve carregar os itens do banco
4. Clique em um item → "Comprar Agora" → saldo deve diminuir
5. Vá ao perfil → Transações deve mostrar a compra

---

## Manter o backend rodando (se a EC2 reiniciar)

Conecte via SSH e execute:
```bash
cd ~/marketplace/backend
source venv/bin/activate
nohup uvicorn main:app --host 0.0.0.0 --port 8000 > ~/uvicorn.log 2>&1 &
```

---

## Problema: credenciais expiram (AWS Academy)

As credenciais do Academy expiram ao fim da sessão do Lab. Para atualizar:
1. Volte ao portal → AWS Details → copie as novas credenciais
2. Reexecute as variáveis `$env:AWS_*` no PowerShell
3. O backend na EC2 continua rodando (não precisa redeployar)
