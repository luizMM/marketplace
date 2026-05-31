# GameVault — Marketplace de Itens de Jogos

Projeto da disciplina **Computação em Nuvem** — Insper, 1º Semestre de 2026.

MVP de um marketplace onde jogadores compram e vendem skins e itens de games,
com arquitetura distribuída na AWS e processamento assíncrono de pagamentos via Lambda.

---

## Arquitetura

```
Navegador do usuário
        │
        ▼
┌─────────────────────────────────┐
│  S3  — Static Website Hosting   │  Serve o frontend React (HTML/CSS/JS)
└─────────────────────────────────┘
        │ chamadas à API
        ▼
┌─────────────────────────────────┐
│  ALB — Application Load Balancer│  Distribui tráfego entre instâncias EC2
└─────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────┐
│  ASG — Auto Scaling Group       │  Escala EC2 automaticamente sob carga
│  EC2  t2.micro (Amazon Linux)   │  Roda FastAPI + uvicorn (porta 8000)
└─────────────────────────────────┘
        │                  │
        ▼                  ▼
┌──────────────┐   ┌────────────────────────┐
│  DynamoDB    │   │  Lambda                │
│  3 tabelas   │◄──│  gamevault-processor   │
│  (NoSQL)     │   │  Processa transações   │
└──────────────┘   │  de forma assíncrona   │
                   └────────────────────────┘
```

### Fluxo de uma compra (processamento assíncrono)

```
1. Usuário clica "Comprar Agora"
        ↓
2. POST /purchase → EC2 (via ALB)
   - Valida saldo e disponibilidade do item
   - Registra transação como "pendente" no DynamoDB
   - Invoca Lambda de forma assíncrona (fire-and-forget)
   - Retorna imediatamente: { transaction_id, status: "pendente" }
        ↓
3. Frontend faz polling em GET /transactions/{id} a cada 1s
        ↓
4. Lambda executa em paralelo (~1-2s):
   - Debita saldo do comprador no DynamoDB
   - Credita saldo do vendedor
   - Transfere propriedade do item
   - Atualiza status para "concluida"
        ↓
5. Frontend detecta "concluida" → atualiza saldo → exibe sucesso
```

### Serviços AWS utilizados e justificativas

| Serviço | Função | Por que foi escolhido |
|---------|--------|-----------------------|
| **VPC** | Rede isolada onde EC2 e ALB rodam | Isola a infraestrutura; subnets públicas permitem acesso externo ao ALB |
| **EC2 t2.micro** | Executa a API FastAPI + uvicorn | Controle total sobre o ambiente de execução |
| **ALB** | Balanceador de carga na frente das EC2 | Distribui tráfego entre instâncias do ASG; expõe DNS fixo independente de IPs |
| **ASG** | Escala instâncias EC2 automaticamente | Garante disponibilidade e absorve picos de carga sem intervenção manual |
| **S3** | Hospeda o frontend como site estático | Sem servidor para gerenciar; escalabilidade automática; custo baixo |
| **Lambda** | Processa transações de forma assíncrona | Desacopla recebimento da requisição do processamento; arquitetura orientada a eventos |
| **DynamoDB** | Banco de dados NoSQL | Serverless, escalável e gerenciado pela AWS; sem necessidade de administrar instância de banco |

### Stack técnica

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React 19 + Vite + Tailwind CSS |
| Backend/API | Python 3 + FastAPI + uvicorn |
| Processamento assíncrono | AWS Lambda (Python 3.12) |
| Banco de dados | AWS DynamoDB (3 tabelas) |
| Hospedagem frontend | AWS S3 (static website hosting) |
| Infraestrutura | EC2 + ALB + ASG na VPC padrão (us-east-1) |

---

## Pré-requisitos

- [AWS CLI v2](https://awscli.amazonaws.com/AWSCLIV2.msi) instalado
- Python 3.9+ com `boto3` instalado (`pip install boto3`)
- Node.js 18+ instalado

---

## Como rodar (deploy completo)

### 1. Configurar credenciais AWS

No console AWS, abra o **CloudShell** e rode:

```bash
python3 -c "import boto3; c = boto3.Session().get_credentials().get_frozen_credentials(); print(c.access_key); print(c.secret_key); print(c.token)"
```

Copie os 3 valores e cole no PowerShell do seu PC:

```powershell
$env:AWS_ACCESS_KEY_ID     = "primeiro valor"
$env:AWS_SECRET_ACCESS_KEY = "segundo valor"
$env:AWS_SESSION_TOKEN     = "terceiro valor"
$env:AWS_DEFAULT_REGION    = "us-east-1"
```

### 2. Rodar o script de deploy

```powershell
cd marketplace-insper\deploy
python deploy_tudo.py
```

O script faz tudo automaticamente:
- Cria tabelas DynamoDB (`gamevault-users`, `gamevault-items`, `gamevault-transactions`)
- Faz deploy da Lambda (`gamevault-processor`)
- Empacota e envia o backend para S3
- Cria Security Groups, Key Pair, Launch Template
- Sobe EC2 via ASG com user_data (instala dependências automaticamente)
- Cria ALB e registra as instâncias
- Faz build do frontend React e sobe no S3 com website hosting
- Popula o banco com dados de teste

Ao final, o script imprime as URLs:
```
Frontend : http://gamevault-frontend-XXXX.s3-website-us-east-1.amazonaws.com
API      : http://gamevault-alb-XXX.us-east-1.elb.amazonaws.com
```

> A EC2 pode levar 1-2 minutos para ficar pronta (user_data instala dependências ao iniciar).

---

## Testar o sistema

Abra a URL do frontend no navegador.

| Usuário | Email | Senha |
|---------|-------|-------|
| Jogador | `jogador@email.com` | `123456` |
| Vendedor 1 | `protrader@email.com` | `123456` |
| Vendedor 2 | `skinmaster@email.com` | `123456` |

**Fluxo principal:**
1. Login como `jogador@email.com`
2. Marketplace → escolha um item → **Comprar Agora**
3. Observe o spinner "Processando..." (~1-2s enquanto a Lambda executa)
4. Tela de sucesso com saldo atualizado
5. Perfil → Transações → compra aparece como "concluida"

**Testar a API diretamente:**
```powershell
curl http://DNS_DO_ALB/health    # {"status":"ok"}
curl http://DNS_DO_ALB/items     # lista de itens do DynamoDB
```

---

## Atualizar o backend após mudanças no código

```powershell
cd marketplace-insper\deploy

# Re-empacota e sobe para S3 (substitua ACCOUNT_ID pelo seu ID de conta)
.\pack_backend.ps1
aws s3 cp backend.zip s3://gamevault-deploy-ACCOUNT_ID/backend.zip

# Força o ASG a trocar as instâncias (rolling update)
aws autoscaling start-instance-refresh --auto-scaling-group-name gamevault-asg

# Atualiza também a Lambda
python setup_aws.py
```

---

## Estrutura do projeto

```
marketplace-insper/
├── backend/
│   ├── main.py              # API FastAPI — login, itens, compra, status da transação
│   ├── models.py            # Modelos Pydantic (User, Item, Transaction)
│   ├── database.py          # Conexão com DynamoDB via boto3
│   ├── lambda_function.py   # Handler da Lambda (processamento assíncrono)
│   ├── seed_db.py           # Popula DynamoDB com dados de teste
│   └── requirements.txt     # fastapi, uvicorn, boto3, python-dotenv
├── frontend/
│   ├── src/
│   │   ├── pages/           # Marketplace, Login, ItemDetail, Perfil...
│   │   └── context/         # Contexto de autenticação
│   └── .env.example         # VITE_API_URL=http://DNS_DO_ALB
└── deploy/
    ├── deploy_tudo.py       # Script principal — cria toda a infra AWS
    ├── setup_aws.py         # Só DynamoDB + Lambda (se já tiver EC2)
    ├── pack_backend.ps1     # Empacota backend em backend.zip
    └── gamevault-key.pem    # Chave SSH gerada automaticamente (não versionar!)
```

---

## Problemas comuns

| Problema | Causa | Solução |
|----------|-------|---------|
| `NoCredentialError` | `aws configure` não feito | Rodar `aws configure` |
| `ResourceNotFoundException` | Tabelas não criadas | Rodar `deploy_tudo.py` |
| Frontend não carrega itens | EC2 ainda inicializando | Aguardar 1-2 min após o deploy |
| Lambda não finaliza transação | Role sem permissão | Verificar se `setup_aws.py` criou a Lambda com LabRole/gamevault-role |
| `BucketAlreadyExists` no S3 | Nome de bucket já ocupado | Alterar a variável `PROJECT` em `deploy_tudo.py` |
