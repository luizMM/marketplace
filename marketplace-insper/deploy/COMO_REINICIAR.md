# Como Reativar o Projeto Após o Lab Encerrar

Toda vez que o Lab do AWS Academy encerrar, a EC2 para, o IP muda e os arquivos são apagados.
Siga esses passos na ordem para tudo voltar a funcionar.

---

## PASSO 1 — Iniciar o Lab e pegar as credenciais

1. Acesse o portal do **AWS Academy** e entre no seu curso
2. Clique em **Learner Lab** e depois em **Start Lab**
3. Aguarde o círculo ficar **verde** (pode demorar 1-2 minutos)
4. Clique em **AWS Details** → **AWS CLI** — vai aparecer um bloco de texto
5. Abra o **PowerShell** e cole os valores um por um:

```powershell
$env:AWS_ACCESS_KEY_ID     = "COLE_O_aws_access_key_id_AQUI"
$env:AWS_SECRET_ACCESS_KEY = "COLE_O_aws_secret_access_key_AQUI"
$env:AWS_SESSION_TOKEN     = "COLE_O_aws_session_token_AQUI"
$env:AWS_DEFAULT_REGION    = "us-east-1"
```

6. Teste: `aws sts get-caller-identity` (deve retornar seu usuário)

> ⚠️ Essas credenciais expiram quando o Lab encerrar. Na próxima sessão, repita esse passo.

---

## PASSO 2 — Verificar o IP da EC2

```powershell
aws ec2 describe-instances --query "Reservations[*].Instances[*].PublicIpAddress" --output text
```

Anote o IP que aparecer (ex: `34.230.77.206`). Substitua **SEU_IP** nos próximos passos.

---

## PASSO 3 — Corrigir permissões do labsuser.pem

O arquivo `.pem` está em `marketplace-insper\deploy\labsuser.pem`. A cada sessão, ajuste as permissões:

```powershell
icacls "C:\Users\lujiq\Downloads\marketplace\marketplace-insper\deploy\labsuser.pem" /inheritance:r /grant:r "${env:USERNAME}:(R)"
```

> ⚠️ Se der "acesso negado", rode primeiro:
> ```powershell
> takeown /f "C:\Users\lujiq\Downloads\marketplace\marketplace-insper\deploy\labsuser.pem"
> ```
> Depois repita o `icacls`.

Teste a conexão SSH:

```powershell
ssh -i "C:\Users\lujiq\Downloads\marketplace\marketplace-insper\deploy\labsuser.pem" ec2-user@SEU_IP
```

---

## PASSO 4 — Liberar as portas no Security Group

Descubra o ID do security group:

```powershell
aws ec2 describe-security-groups --query "SecurityGroups[*].{Nome:GroupName,ID:GroupId}" --output table
```

Copie o ID da linha `Ec2SecurityGroup` e rode (substituindo o ID):

```powershell
aws ec2 authorize-security-group-ingress --group-id sg-XXXXXXXX --protocol tcp --port 80 --cidr 0.0.0.0/0
aws ec2 authorize-security-group-ingress --group-id sg-XXXXXXXX --protocol tcp --port 8000 --cidr 0.0.0.0/0
```

> Se der erro dizendo que a regra já existe, pode ignorar.

---

## PASSO 5 — Enviar o backend para a EC2

Primeiro, regere o `backend.zip` com os arquivos atuais:

```powershell
cd "C:\Users\lujiq\Downloads\marketplace\marketplace-insper\deploy"
.\pack_backend.ps1
```

Envie para a EC2:

```powershell
scp -i "C:\Users\lujiq\Downloads\marketplace\marketplace-insper\deploy\labsuser.pem" "C:\Users\lujiq\Downloads\marketplace\marketplace-insper\deploy\backend.zip" ec2-user@SEU_IP:~/
```

---

## PASSO 6 — Instalar e subir o backend na EC2

Conecte via SSH e rode bloco por bloco:

```bash
pkill -f uvicorn 2>/dev/null || true
rm -rf ~/marketplace/backend
mkdir -p ~/marketplace/backend
unzip ~/backend.zip -d ~/marketplace/backend
cd ~/marketplace/backend
```

```bash
sudo dnf install -y python3-pip unzip
python3 -m venv venv
source venv/bin/activate
pip install fastapi==0.115.0 uvicorn==0.30.0 sqlmodel==0.0.21 sqlalchemy==2.0.36 python-dotenv==1.0.1
```

```bash
echo "DATABASE_URL=sqlite:///marketplace.db" > .env
python seed_db.py
nohup uvicorn main:app --host 0.0.0.0 --port 8000 > ~/uvicorn.log 2>&1 &
sleep 2 && curl http://localhost:8000/health
```

Deve aparecer: `{"status":"ok"}`

> ⚠️ Se aparecer `ModuleNotFoundError: No module named 'dotenv'`, rode:
> ```bash
> pip install python-dotenv==1.0.1
> ```
> Depois repita o último bloco.

---

## PASSO 7 — Instalar nginx e subir o frontend

**No SSH da EC2:**

```bash
sudo dnf install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

**No PowerShell do seu PC** (substitua SEU_IP):

```powershell
Set-Content "C:\Users\lujiq\Downloads\marketplace\marketplace-insper\frontend\.env" "VITE_API_URL=http://SEU_IP:8000"
```

```powershell
cd "C:\Users\lujiq\Downloads\marketplace\marketplace-insper\frontend"
npm run build
```

```powershell
scp -i "C:\Users\lujiq\Downloads\marketplace\marketplace-insper\deploy\labsuser.pem" -r dist\* ec2-user@SEU_IP:~/dist/
```

**De volta no SSH:**

```bash
sudo cp -r ~/dist/* /usr/share/nginx/html/
sudo chmod -R 755 /usr/share/nginx/html/
sudo chown -R nginx:nginx /usr/share/nginx/html/
sudo systemctl restart nginx
```

---

## PASSO 8 — Testar

Abra no navegador: **http://SEU_IP**

- Login: `jogador@email.com` / `123456`
- O marketplace deve carregar os itens
- Compra deve funcionar e aparecer nas Transações

---

## Problemas comuns

| Problema | Causa | Solução |
|----------|-------|---------|
| Timeout ao abrir no navegador | Portas 80/8000 bloqueadas | Refazer o Passo 4 |
| `Permission denied (publickey)` no SSH/SCP | Permissão errada no .pem | Refazer o Passo 3 |
| `ModuleNotFoundError: dotenv` | Pacote não instalado | `pip install python-dotenv==1.0.1` |
| Login diz "backend não encontrado" | uvicorn não está rodando | SSH na EC2 e rodar o Passo 6 novamente |
| Frontend com IP errado | .env desatualizado | Refazer o Passo 7 com o novo IP |
