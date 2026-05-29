# Resumo da Arquitetura AWS — GameVault Marketplace

## Visão Geral

```
Usuário (navegador)
       │
       ▼
  EC2 porta 80
  ┌─────────────────────────────────────────┐
  │  nginx                                  │
  │  Serve os arquivos estáticos do React   │
  │  (HTML, CSS, JavaScript)                │
  └─────────────────────────────────────────┘
       │  chamadas à API (fetch)
       ▼
  EC2 porta 8000
  ┌─────────────────────────────────────────┐
  │  FastAPI (uvicorn)                      │
  │  Processa requisições:                  │
  │  - Login / Cadastro                     │
  │  - Listagem de itens                    │
  │  - Compra de itens                      │
  │  - Histórico de transações              │
  └─────────────────────────────────────────┘
       │
       ▼
  ┌─────────────────────────────────────────┐
  │  SQLite (arquivo marketplace.db)        │
  │  Armazena usuários, itens e transações  │
  └─────────────────────────────────────────┘
```

---

## Serviços AWS Utilizados

### EC2 (Elastic Compute Cloud)
- **O que é:** Máquina virtual na nuvem da AWS
- **Tipo:** t2.micro (1 vCPU, 1GB RAM) — elegível ao free tier
- **Sistema:** Amazon Linux 2023
- **O que roda nela:**
  - **nginx** na porta 80: servidor web que entrega o frontend React ao navegador
  - **uvicorn + FastAPI** na porta 8000: API que processa toda a lógica de negócio (compras, login, listagem de itens) e lê/escreve no banco de dados SQLite
- **Por que EC2:** É o serviço mais fundamental de computação na nuvem. Permite rodar qualquer aplicação como se fosse um servidor próprio, mas gerenciado pela AWS.

### Security Group
- **O que é:** Firewall virtual que controla o tráfego de entrada e saída da EC2
- **Regras configuradas:**
  - Porta 22 (SSH): para acesso remoto à máquina
  - Porta 80 (HTTP): para o frontend ser acessível pelo navegador
  - Porta 8000 (API): para o frontend se comunicar com o backend

---

## Fluxo de uma Compra (exemplo completo)

```
1. Usuário clica "Comprar Agora" no navegador
         ↓
2. React (rodando no navegador do usuário) envia:
   POST http://54.235.52.37:8000/purchase?buyer_id=3&item_id=2
         ↓
3. FastAPI na EC2 recebe a requisição:
   - Verifica se o usuário tem saldo suficiente
   - Debita o saldo do comprador
   - Credita o saldo do vendedor
   - Registra a transação no banco
   - Transfere a propriedade do item
         ↓
4. Retorna { "message": "Transação realizada", "new_balance": 1550.0 }
         ↓
5. React atualiza o saldo exibido no header
```

---

## Arquivos e Tecnologias

| Camada | Tecnologia | Onde roda |
|--------|-----------|-----------|
| Frontend | React 19 + Vite + Tailwind CSS | Navegador do usuário |
| Servidor web | nginx | EC2 (porta 80) |
| Backend/API | Python + FastAPI + uvicorn | EC2 (porta 8000) |
| Banco de dados | SQLite | EC2 (arquivo .db) |
| Infraestrutura | AWS EC2 t2.micro | us-east-1 (N. Virginia) |
