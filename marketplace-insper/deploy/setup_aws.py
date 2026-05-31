"""
Cria as tabelas DynamoDB e faz o deploy da Lambda.
Execute uma vez antes de subir o backend.

Usage:
  1. Configure as credenciais AWS no PowerShell (variáveis $env:AWS_*)
  2. python setup_aws.py
"""
import boto3
import zipfile
import os
import io
import time

REGION = 'us-east-1'

dynamodb_client = boto3.client('dynamodb', region_name=REGION)
lambda_client = boto3.client('lambda', region_name=REGION)
iam_client = boto3.client('iam', region_name=REGION)


def get_lab_role_arn():
    roles = iam_client.list_roles()['Roles']
    for role in roles:
        if 'LabRole' in role['RoleName']:
            return role['Arn']
    raise Exception("LabRole não encontrada. Verifique as credenciais AWS.")


def create_table(name, pk):
    try:
        dynamodb_client.create_table(
            TableName=name,
            KeySchema=[{'AttributeName': pk, 'KeyType': 'HASH'}],
            AttributeDefinitions=[{'AttributeName': pk, 'AttributeType': 'S'}],
            BillingMode='PAY_PER_REQUEST',
        )
        print(f"  [OK] Tabela '{name}' criada.")
    except dynamodb_client.exceptions.ResourceInUseException:
        print(f"  [--] Tabela '{name}' já existe.")


def wait_tables(names):
    print("  Aguardando tabelas ficarem ativas...", end='', flush=True)
    for name in names:
        waiter = dynamodb_client.get_waiter('table_exists')
        waiter.wait(TableName=name)
        print('.', end='', flush=True)
    print(" pronto.")


def deploy_lambda(role_arn):
    lambda_src = os.path.join(os.path.dirname(__file__), '..', 'backend', 'lambda_function.py')
    lambda_src = os.path.abspath(lambda_src)

    buf = io.BytesIO()
    with zipfile.ZipFile(buf, 'w', zipfile.ZIP_DEFLATED) as zf:
        zf.write(lambda_src, 'lambda_function.py')
    zip_bytes = buf.getvalue()

    try:
        lambda_client.create_function(
            FunctionName='gamevault-processor',
            Runtime='python3.12',
            Role=role_arn,
            Handler='lambda_function.lambda_handler',
            Code={'ZipFile': zip_bytes},
            Timeout=30,
            MemorySize=128,
        )
        print("  [OK] Lambda 'gamevault-processor' criada.")
    except lambda_client.exceptions.ResourceConflictException:
        # Aguarda estado estável antes de atualizar
        time.sleep(5)
        lambda_client.update_function_code(
            FunctionName='gamevault-processor',
            ZipFile=zip_bytes,
        )
        print("  [OK] Lambda 'gamevault-processor' atualizada.")


if __name__ == '__main__':
    print("=== GameVault — Setup AWS ===\n")

    print("1. Criando tabelas DynamoDB...")
    tables = ['gamevault-users', 'gamevault-items', 'gamevault-transactions']
    for t in tables:
        create_table(t, 'id')
    wait_tables(tables)

    print("\n2. Buscando LabRole...")
    role_arn = get_lab_role_arn()
    print(f"  [OK] LabRole: {role_arn}")

    print("\n3. Fazendo deploy da Lambda...")
    deploy_lambda(role_arn)

    print("\n=== Setup concluído! ===")
    print("Próximo passo: python ../backend/seed_db.py")
