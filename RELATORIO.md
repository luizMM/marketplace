# Relatório Técnico — GameVault
## Plataforma Escalável em Nuvem para Processamento de Pagamentos
**Disciplina:** Computação em Nuvem — Insper, 1º Semestre de 2026

https://youtu.be/i1X3kDbb-HY
---

## 1. Introdução

Este relatório descreve o desenvolvimento do GameVault, um marketplace de itens de jogos
construído como MVP (Minimum Viable Product) para a disciplina de Computação em Nuvem.
O sistema permite que usuários comprem e vendam skins e itens de games, com processamento
de pagamentos baseado em arquitetura distribuída na AWS.

O foco do projeto está na arquitetura técnica e na integração entre serviços de nuvem,
demonstrando conceitos de processamento assíncrono, escalabilidade e separação de
responsabilidades entre componentes.

---

## 2. Arquitetura

### 2.1 Visão Geral

```
Navegador do usuário
        │
        ▼
┌─────────────────────────────────┐
│  S3  — Static Website Hosting   │  Serve o frontend React
└─────────────────────────────────┘
        │ chamadas à API
        ▼
┌─────────────────────────────────┐
│  ALB — Application Load Balancer│  Distribui tráfego entre EC2
└─────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────┐
│  ASG — Auto Scaling Group       │  Escala EC2 automaticamente
│  EC2  t2.micro (Amazon Linux)   │  Roda FastAPI + uvicorn
└─────────────────────────────────┘
        │                  │
        ▼                  ▼
┌──────────────┐   ┌────────────────────────┐
│  DynamoDB    │   │  Lambda                │
│  3 tabelas   │◄──│  gamevault-processor   │
│  (NoSQL)     │   │  Processamento async   │
└──────────────┘   └────────────────────────┘
```

### 2.2 Camadas do sistema

**Camada de entrada:** o ALB recebe todas as requisições HTTP e as distribui entre as
instâncias EC2 do ASG. O frontend é servido diretamente pelo S3, sem passar pelo ALB.

**Camada de aplicação:** a API REST em FastAPI roda nas instâncias EC2, processando
login, listagem de itens, criação de compras e consulta de transações.

**Camada de processamento assíncrono:** ao receber uma compra, a API registra a
transação como "pendente" e invoca a Lambda de forma assíncrona (fire-and-forget),
retornando imediatamente ao cliente. A Lambda executa em paralelo, debitando o
comprador, creditando o vendedor, transferindo o item e marcando a transação como
"concluída".

**Camada de persistência:** o DynamoDB armazena usuários, itens e transações em
três tabelas independentes, com acesso via boto3 tanto pela API quanto pela Lambda.

---

## 3. Serviços AWS Utilizados e Justificativas

### VPC (Virtual Private Cloud)
A infraestrutura roda dentro de uma VPC com subnets públicas em múltiplas zonas de
disponibilidade. A VPC isola os recursos do projeto e permite que o ALB opere em
alta disponibilidade distribuído entre zonas.

### EC2 (Elastic Compute Cloud)
Instâncias t2.micro com Amazon Linux 2023 executam o backend FastAPI via uvicorn.
A escolha do EC2 permite controle total sobre o ambiente de execução e integra
naturalmente com o ASG para escalabilidade.

### ALB (Application Load Balancer)
O ALB distribui o tráfego entre as instâncias EC2 do ASG e expõe um DNS fixo,
desacoplando os clientes dos IPs das máquinas. O health check em `/health`
garante que requisições só chegam a instâncias saudáveis.

### ASG (Auto Scaling Group)
O ASG mantém entre 1 e 2 instâncias EC2 rodando, garantindo disponibilidade mesmo
em caso de falha de uma instância. As instâncias são configuradas via Launch Template
com user data que instala automaticamente as dependências ao iniciar.

### S3 (Simple Storage Service)
O frontend React é hospedado como site estático no S3 com website hosting habilitado.
Essa abordagem elimina a necessidade de um servidor web dedicado para servir arquivos
estáticos, reduzindo custos e complexidade operacional.

### Lambda
A função `gamevault-processor` processa as transações de forma assíncrona. Ao ser
invocada pela API com `InvocationType='Event'`, executa sem bloquear a resposta ao
cliente. Isso demonstra o padrão de arquitetura orientada a eventos e desacoplamento
entre componentes.

### DynamoDB
Banco de dados NoSQL serverless que armazena os dados do sistema em três tabelas:
`gamevault-users`, `gamevault-items` e `gamevault-transactions`. A escolha pelo
DynamoDB elimina a necessidade de administrar instâncias de banco de dados e oferece
escalabilidade automática.

---

## 4. Fluxo Principal: Processamento de Pagamento

O fluxo de uma compra demonstra o processamento assíncrono:

1. **Usuário clica "Comprar Agora"** no frontend React
2. **Frontend envia** `POST /purchase?buyer_id=X&item_id=Y` para o ALB
3. **ALB roteia** para uma instância EC2 saudável
4. **API (FastAPI) valida** saldo do comprador e disponibilidade do item
5. **API registra** transação com status `"pendente"` no DynamoDB
6. **API invoca** a Lambda de forma assíncrona (`InvocationType='Event'`)
7. **API retorna imediatamente** `{ transaction_id, status: "pendente" }`
8. **Frontend faz polling** em `GET /transactions/{id}` a cada 1 segundo
9. **Lambda executa em paralelo:**
   - Debita saldo do comprador no DynamoDB
   - Credita saldo do vendedor
   - Transfere propriedade do item
   - Atualiza status para `"concluida"`
10. **Frontend detecta** `status: "concluida"` → atualiza saldo → exibe sucesso

---

## 5. Implementação Técnica

### Backend
- **Linguagem:** Python 3.12
- **Framework:** FastAPI com uvicorn
- **Banco de dados:** boto3 (DynamoDB resource API)
- **Endpoints principais:**
  - `GET /health` — health check para o ALB
  - `POST /login` — autenticação por email/senha
  - `GET /items` — listagem de itens disponíveis
  - `POST /purchase` — inicia compra assíncrona
  - `GET /transactions/{id}` — consulta status da transação

### Lambda
- **Runtime:** Python 3.12
- **Handler:** `lambda_function.lambda_handler`
- **Timeout:** 30 segundos
- **Trigger:** invocação assíncrona via boto3 pela API

### Frontend
- **Framework:** React 19 com Vite
- **Estilização:** Tailwind CSS
- **Hospedagem:** S3 Static Website Hosting
- **Comunicação:** fetch API apontando para o DNS do ALB

### Deploy
Todo o provisionamento da infraestrutura foi automatizado via script Python
(`deploy_tudo.py`) usando boto3, criando todos os recursos programaticamente
sem intervenção manual no console AWS.

---

## 6. Decisões Técnicas

**Por que DynamoDB em vez de RDS?**
O DynamoDB é serverless e não requer administração de instâncias. Para um MVP com
volume de dados reduzido, simplifica o deploy e elimina custos fixos de uma instância
de banco relacional.

**Por que Lambda para processamento assíncrono?**
A Lambda desacopla o recebimento da requisição do processamento efetivo, permitindo
que a API responda imediatamente ao cliente. Isso melhora a experiência do usuário
e demonstra o padrão de arquitetura orientada a eventos recomendado pelo projeto.

**Por que ALB em vez de expor o EC2 diretamente?**
O ALB permite distribuir tráfego entre múltiplas instâncias EC2 gerenciadas pelo ASG,
fornece health checks automáticos e expõe um DNS estável independente dos IPs das
instâncias.

**Por que S3 para o frontend?**
Servir arquivos estáticos via S3 é mais simples, barato e escalável do que configurar
nginx em uma EC2 adicional. O S3 website hosting resolve completamente a necessidade
sem overhead operacional.

---

## 7. Limitações e Melhorias Possíveis

- **Queries no DynamoDB:** as buscas usam `scan` em vez de índices secundários (GSI),
o que não seria eficiente em escala real com milhões de registros. Para produção,
seria necessário criar GSIs para buscas por email e por buyer_id/seller_id.

- **Autenticação:** o sistema usa SHA-256 simples para senhas, sem salt. Em produção
seria necessário usar bcrypt ou Argon2 e implementar JWT.

- **Testes de carga:** não foram realizados testes formais com JMeter no escopo deste
MVP. O ASG está configurado para escalar até 2 instâncias, mas sem uma política de
scaling baseada em métricas de CPU.

- **HTTPS:** o sistema opera em HTTP. Em produção seria necessário um certificado SSL
no ALB.

---

## 8. Nível Atingido na Rubrica

| Critério | Nível | Justificativa |
|----------|-------|---------------|
| **Argumentação técnica** | C+ | Justificamos cada serviço AWS escolhido com base nos requisitos do sistema, demonstrando entendimento dos componentes principais e seus trade-offs |
| **Maturidade da solução** | C+ | Os fluxos centrais funcionam com coerência: login, listagem, compra assíncrona e histórico de transações, com múltiplos serviços integrados |
| **Dificuldade de implementação** | C+/B | Integração de 7 serviços AWS (VPC, EC2, ALB, ASG, S3, Lambda, DynamoDB) com processamento assíncrono e deploy automatizado via boto3 |
| **Documentação** | C+ | README com arquitetura, diagrama, justificativas, instruções de deploy e relatório técnico |
| **Evidências** | C+ | Vídeo demonstrando o sistema funcionando ao vivo com todos os serviços visíveis no console AWS |

**Nível geral alcançado: C+**

O projeto implementa o núcleo básico do MVP com múltiplos componentes AWS integrados,
fluxos principais funcionando com coerência e documentação organizada. A principal
limitação em relação ao nível B é a ausência de testes de carga formais e análise
de performance sob estresse.

---

## 9. Conclusão

O GameVault demonstra na prática a construção de uma plataforma distribuída em nuvem,
integrando serviços AWS de forma coesa para atender os requisitos de escalabilidade,
processamento assíncrono e separação de responsabilidades. O uso de Lambda para
desacoplar o processamento de pagamentos e do ALB+ASG para garantir disponibilidade
reflete padrões utilizados em sistemas modernos de tecnologia financeira.
