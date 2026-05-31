"""
GameVault — Deploy completo via terminal.
Cria toda a infraestrutura AWS do zero e sobe o projeto.

Pré-requisitos:
  - aws configure (credenciais permanentes configuradas uma vez)
  - Python 3.9+ com boto3 instalado
  - Node.js 18+ instalado (para npm run build)

Usage:
  python deploy_tudo.py
"""
import boto3
import subprocess
import zipfile
import io
import os
import sys
import json
import time
import base64

REGION = 'us-east-1'
PROJECT = 'gamevault'
BACKEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend'))
FRONTEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'frontend'))

# Clientes AWS
ec2 = boto3.client('ec2', region_name=REGION)
elb = boto3.client('elbv2', region_name=REGION)
asg_client = boto3.client('autoscaling', region_name=REGION)
dynamodb = boto3.client('dynamodb', region_name=REGION)
lambda_client = boto3.client('lambda', region_name=REGION)
iam = boto3.client('iam', region_name=REGION)
s3 = boto3.client('s3', region_name=REGION)
sts = boto3.client('sts', region_name=REGION)


# ──────────────────────────────────────────────
# Helpers
# ──────────────────────────────────────────────

def ok(msg):   print(f"  [OK] {msg}")
def skip(msg): print(f"  [--] {msg}")
def step(msg): print(f"\n{'='*50}\n{msg}\n{'='*50}")


def get_account_id():
    return sts.get_caller_identity()['Account']


def get_role_arn(name_fragment):
    paginator = iam.get_paginator('list_roles')
    for page in paginator.paginate():
        for role in page['Roles']:
            if name_fragment in role['RoleName']:
                return role['Arn']
    return None


def get_default_vpc():
    # Tenta VPC padrão primeiro
    vpcs = ec2.describe_vpcs(Filters=[{'Name': 'isDefault', 'Values': ['true']}])['Vpcs']
    if vpcs:
        return vpcs[0]['VpcId']
    # Fallback: qualquer VPC disponível
    vpcs = ec2.describe_vpcs(Filters=[{'Name': 'state', 'Values': ['available']}])['Vpcs']
    if vpcs:
        ok(f"VPC padrão não encontrada, usando: {vpcs[0]['VpcId']}")
        return vpcs[0]['VpcId']
    # Cria a VPC padrão
    print("  Nenhuma VPC encontrada. Criando VPC padrão...")
    ec2.create_default_vpc()
    vpcs = ec2.describe_vpcs(Filters=[{'Name': 'isDefault', 'Values': ['true']}])['Vpcs']
    ok(f"VPC padrão criada: {vpcs[0]['VpcId']}")
    return vpcs[0]['VpcId']


def get_public_subnets(vpc_id):
    subnets = ec2.describe_subnets(Filters=[
        {'Name': 'vpc-id', 'Values': [vpc_id]},
        {'Name': 'map-public-ip-on-launch', 'Values': ['true']},
    ])['Subnets']
    if len(subnets) < 2:
        # Pega todas as subnets da VPC se não encontrar com auto-assign
        subnets = ec2.describe_subnets(Filters=[
            {'Name': 'vpc-id', 'Values': [vpc_id]},
        ])['Subnets']
    return [s['SubnetId'] for s in subnets[:3]]


# ──────────────────────────────────────────────
# 1. IAM
# ──────────────────────────────────────────────

def setup_iam():
    step("1. IAM — Roles")

    # Tenta usar LabRole (Academy) primeiro
    lab_role = get_role_arn('LabRole')
    if lab_role:
        ok(f"Usando LabRole existente: {lab_role}")
        lab_instance_profile = get_instance_profile_arn('LabInstanceProfile')
        if not lab_instance_profile:
            lab_instance_profile = create_instance_profile_for_role('LabRole')
        return lab_role, lab_instance_profile

    # Conta real: cria roles próprias
    ec2_role_arn = ensure_ec2_role()
    instance_profile_arn = ensure_instance_profile(ec2_role_arn)
    lambda_role_arn = ensure_lambda_role()
    return lambda_role_arn, instance_profile_arn


def get_instance_profile_arn(name):
    try:
        profile = iam.get_instance_profile(InstanceProfileName=name)
        return profile['InstanceProfile']['Arn']
    except iam.exceptions.NoSuchEntityException:
        return None


def create_instance_profile_for_role(role_name):
    profile_name = f"{PROJECT}-ec2-profile"
    try:
        profile = iam.create_instance_profile(InstanceProfileName=profile_name)
        iam.add_role_to_instance_profile(InstanceProfileName=profile_name, RoleName=role_name)
        ok(f"Instance profile criado: {profile_name}")
        time.sleep(10)
        return profile['InstanceProfile']['Arn']
    except iam.exceptions.EntityAlreadyExistsException:
        p = iam.get_instance_profile(InstanceProfileName=profile_name)
        skip(f"Instance profile já existe: {profile_name}")
        return p['InstanceProfile']['Arn']


def ensure_ec2_role():
    role_name = f"{PROJECT}-ec2-role"
    try:
        role = iam.get_role(RoleName=role_name)
        skip(f"Role EC2 já existe: {role_name}")
        return role['Role']['Arn']
    except iam.exceptions.NoSuchEntityException:
        pass

    assume = json.dumps({"Version": "2012-10-17", "Statement": [
        {"Effect": "Allow", "Principal": {"Service": "ec2.amazonaws.com"}, "Action": "sts:AssumeRole"}
    ]})
    role = iam.create_role(RoleName=role_name, AssumeRolePolicyDocument=assume)
    for policy in ['AmazonDynamoDBFullAccess', 'AWSLambda_FullAccess', 'AmazonS3ReadOnlyAccess']:
        iam.attach_role_policy(RoleName=role_name,
                               PolicyArn=f'arn:aws:iam::aws:policy/{policy}')
    ok(f"Role EC2 criada: {role_name}")
    time.sleep(10)
    return role['Role']['Arn']


def ensure_instance_profile(role_arn):
    role_name = role_arn.split('/')[-1]
    profile_name = f"{PROJECT}-ec2-profile"
    try:
        p = iam.get_instance_profile(InstanceProfileName=profile_name)
        skip(f"Instance profile já existe: {profile_name}")
        return p['InstanceProfile']['Arn']
    except iam.exceptions.NoSuchEntityException:
        pass

    profile = iam.create_instance_profile(InstanceProfileName=profile_name)
    iam.add_role_to_instance_profile(InstanceProfileName=profile_name, RoleName=role_name)
    ok(f"Instance profile criado: {profile_name}")
    time.sleep(10)
    return profile['InstanceProfile']['Arn']


def ensure_lambda_role():
    role_name = f"{PROJECT}-lambda-role"
    try:
        role = iam.get_role(RoleName=role_name)
        skip(f"Role Lambda já existe: {role_name}")
        return role['Role']['Arn']
    except iam.exceptions.NoSuchEntityException:
        pass

    assume = json.dumps({"Version": "2012-10-17", "Statement": [
        {"Effect": "Allow", "Principal": {"Service": "lambda.amazonaws.com"}, "Action": "sts:AssumeRole"}
    ]})
    role = iam.create_role(RoleName=role_name, AssumeRolePolicyDocument=assume)
    iam.attach_role_policy(RoleName=role_name,
                           PolicyArn='arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess')
    iam.attach_role_policy(RoleName=role_name,
                           PolicyArn='arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole')
    ok(f"Role Lambda criada: {role_name}")
    time.sleep(10)
    return role['Role']['Arn']


# ──────────────────────────────────────────────
# 2. DynamoDB
# ──────────────────────────────────────────────

def setup_dynamodb():
    step("2. DynamoDB — Tabelas")
    tables = ['gamevault-users', 'gamevault-items', 'gamevault-transactions']
    for name in tables:
        try:
            dynamodb.create_table(
                TableName=name,
                KeySchema=[{'AttributeName': 'id', 'KeyType': 'HASH'}],
                AttributeDefinitions=[{'AttributeName': 'id', 'AttributeType': 'S'}],
                BillingMode='PAY_PER_REQUEST',
            )
            ok(f"Tabela '{name}' criada.")
        except dynamodb.exceptions.ResourceInUseException:
            skip(f"Tabela '{name}' já existe.")

    print("  Aguardando tabelas ativas...", end='', flush=True)
    for name in tables:
        waiter = dynamodb.get_waiter('table_exists')
        waiter.wait(TableName=name)
        print('.', end='', flush=True)
    print(" OK")


# ──────────────────────────────────────────────
# 3. Lambda
# ──────────────────────────────────────────────

def setup_lambda(role_arn):
    step("3. Lambda — gamevault-processor")

    lambda_src = os.path.join(BACKEND_DIR, 'lambda_function.py')
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
        ok("Lambda 'gamevault-processor' criada.")
    except lambda_client.exceptions.ResourceConflictException:
        time.sleep(5)
        lambda_client.update_function_code(
            FunctionName='gamevault-processor', ZipFile=zip_bytes)
        ok("Lambda 'gamevault-processor' atualizada.")


# ──────────────────────────────────────────────
# 4. S3 — Bucket de deploy (backend) e frontend
# ──────────────────────────────────────────────

def setup_s3_deploy_bucket(account_id):
    step("4. S3 — Bucket de deploy do backend")
    bucket = f"{PROJECT}-deploy-{account_id}"
    try:
        if REGION == 'us-east-1':
            s3.create_bucket(Bucket=bucket)
        else:
            s3.create_bucket(Bucket=bucket,
                             CreateBucketConfiguration={'LocationConstraint': REGION})
        ok(f"Bucket '{bucket}' criado.")
    except s3.exceptions.BucketAlreadyOwnedByYou:
        skip(f"Bucket '{bucket}' já existe.")

    # Upload do backend.zip
    pack_backend()
    backend_zip = os.path.join(os.path.dirname(__file__), 'backend.zip')
    s3.upload_file(backend_zip, bucket, 'backend.zip')
    ok(f"backend.zip enviado para s3://{bucket}/backend.zip")
    return bucket


def pack_backend():
    files = ['main.py', 'database.py', 'models.py', 'seed_db.py',
             'requirements.txt', '.env', 'lambda_function.py']
    out = os.path.join(os.path.dirname(__file__), 'backend.zip')
    if os.path.exists(out):
        os.remove(out)
    with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED) as zf:
        for f in files:
            src = os.path.join(BACKEND_DIR, f)
            if os.path.exists(src):
                zf.write(src, f)
    ok(f"backend.zip gerado.")


def setup_s3_frontend_bucket(account_id, alb_dns):
    step("8. S3 — Frontend (build + upload)")
    bucket = f"{PROJECT}-frontend-{account_id}"

    # Build do frontend
    env_file = os.path.join(FRONTEND_DIR, '.env')
    with open(env_file, 'w') as f:
        f.write(f"VITE_API_URL=http://{alb_dns}\n")
    ok(f"VITE_API_URL=http://{alb_dns}")

    print("  Rodando npm install e npm run build...")
    subprocess.run(['npm', 'install'], cwd=FRONTEND_DIR, check=True,
                   stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, shell=True)
    subprocess.run(['npm', 'run', 'build'], cwd=FRONTEND_DIR, check=True,
                   stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, shell=True)
    ok("Build do frontend concluído.")

    # Cria bucket
    try:
        if REGION == 'us-east-1':
            s3.create_bucket(Bucket=bucket)
        else:
            s3.create_bucket(Bucket=bucket,
                             CreateBucketConfiguration={'LocationConstraint': REGION})
        ok(f"Bucket '{bucket}' criado.")
    except s3.exceptions.BucketAlreadyOwnedByYou:
        skip(f"Bucket '{bucket}' já existe.")

    # Habilita website hosting
    s3.put_bucket_website(Bucket=bucket, WebsiteConfiguration={
        'IndexDocument': {'Suffix': 'index.html'},
        'ErrorDocument': {'Key': 'index.html'},
    })

    # Permite acesso público
    s3.put_public_access_block(Bucket=bucket, PublicAccessBlockConfiguration={
        'BlockPublicAcls': False, 'IgnorePublicAcls': False,
        'BlockPublicPolicy': False, 'RestrictPublicBuckets': False,
    })
    s3.put_bucket_policy(Bucket=bucket, Policy=json.dumps({
        "Version": "2012-10-17",
        "Statement": [{"Effect": "Allow", "Principal": "*",
                       "Action": "s3:GetObject",
                       "Resource": f"arn:aws:s3:::{bucket}/*"}],
    }))

    # Upload dos arquivos buildados
    dist_dir = os.path.join(FRONTEND_DIR, 'dist')
    count = 0
    for root, _, files in os.walk(dist_dir):
        for fname in files:
            local = os.path.join(root, fname)
            key = os.path.relpath(local, dist_dir).replace('\\', '/')
            ct = _content_type(fname)
            s3.upload_file(local, bucket, key, ExtraArgs={'ContentType': ct})
            count += 1
    ok(f"{count} arquivos enviados para s3://{bucket}")

    url = f"http://{bucket}.s3-website-{REGION}.amazonaws.com"
    ok(f"Frontend disponível em: {url}")
    return url


def _content_type(filename):
    ext = filename.rsplit('.', 1)[-1].lower()
    return {
        'html': 'text/html', 'css': 'text/css', 'js': 'application/javascript',
        'json': 'application/json', 'png': 'image/png', 'jpg': 'image/jpeg',
        'svg': 'image/svg+xml', 'ico': 'image/x-icon', 'woff2': 'font/woff2',
    }.get(ext, 'application/octet-stream')


# ──────────────────────────────────────────────
# 5. Security Groups
# ──────────────────────────────────────────────

def setup_security_groups(vpc_id):
    step("5. Security Groups")
    alb_sg_id = _ensure_sg('gamevault-alb-sg', 'ALB GameVault', vpc_id, [
        {'IpProtocol': 'tcp', 'FromPort': 80, 'ToPort': 80,
         'IpRanges': [{'CidrIp': '0.0.0.0/0'}]},
    ])
    ec2_sg_id = _ensure_sg('gamevault-ec2-sg', 'EC2 GameVault', vpc_id, [
        {'IpProtocol': 'tcp', 'FromPort': 8000, 'ToPort': 8000,
         'IpRanges': [{'CidrIp': '0.0.0.0/0'}]},
        {'IpProtocol': 'tcp', 'FromPort': 22, 'ToPort': 22,
         'IpRanges': [{'CidrIp': '0.0.0.0/0'}]},
    ])
    return alb_sg_id, ec2_sg_id


def _ensure_sg(name, desc, vpc_id, rules):
    sgs = ec2.describe_security_groups(Filters=[
        {'Name': 'group-name', 'Values': [name]},
        {'Name': 'vpc-id', 'Values': [vpc_id]},
    ])['SecurityGroups']
    if sgs:
        skip(f"Security Group '{name}' já existe: {sgs[0]['GroupId']}")
        return sgs[0]['GroupId']

    sg = ec2.create_security_group(GroupName=name, Description=desc, VpcId=vpc_id)
    sg_id = sg['GroupId']
    ec2.authorize_security_group_ingress(GroupId=sg_id, IpPermissions=rules)
    ok(f"Security Group '{name}' criado: {sg_id}")
    return sg_id


# ──────────────────────────────────────────────
# 6. Key Pair
# ──────────────────────────────────────────────

def setup_key_pair():
    step("6. Key Pair")
    key_name = 'gamevault-key'
    pem_path = os.path.join(os.path.dirname(__file__), f'{key_name}.pem')

    existing = ec2.describe_key_pairs(Filters=[{'Name': 'key-name', 'Values': [key_name]}])
    if existing['KeyPairs']:
        skip(f"Key pair '{key_name}' já existe.")
        if not os.path.exists(pem_path):
            print(f"  AVISO: {pem_path} não encontrado localmente. SSH pode não funcionar.")
        return key_name, pem_path

    kp = ec2.create_key_pair(KeyName=key_name)
    with open(pem_path, 'w') as f:
        f.write(kp['KeyMaterial'])
    os.chmod(pem_path, 0o400)
    ok(f"Key pair criado e salvo em: {pem_path}")
    return key_name, pem_path


# ──────────────────────────────────────────────
# 7. EC2 + ALB + ASG
# ──────────────────────────────────────────────

def get_latest_amazon_linux_ami():
    images = ec2.describe_images(
        Owners=['amazon'],
        Filters=[
            {'Name': 'name', 'Values': ['al2023-ami-*-x86_64']},
            {'Name': 'state', 'Values': ['available']},
        ],
    )['Images']
    images.sort(key=lambda x: x['CreationDate'], reverse=True)
    return images[0]['ImageId']


def user_data_script(deploy_bucket):
    script = f"""#!/bin/bash
set -e
dnf install -y python3-pip unzip
aws s3 cp s3://{deploy_bucket}/backend.zip /opt/gamevault.zip
mkdir -p /opt/gamevault
unzip -o /opt/gamevault.zip -d /opt/gamevault
cd /opt/gamevault
python3 -m venv venv
source venv/bin/activate
pip install -q fastapi==0.115.0 uvicorn==0.30.0 boto3==1.35.0 python-dotenv==1.0.1
echo "AWS_REGION=us-east-1" > .env
cat > /etc/systemd/system/gamevault.service << 'EOF'
[Unit]
Description=GameVault API
After=network.target

[Service]
Type=simple
WorkingDirectory=/opt/gamevault
ExecStart=/opt/gamevault/venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF
systemctl daemon-reload
systemctl enable gamevault
systemctl start gamevault
"""
    return base64.b64encode(script.encode()).decode()


def setup_ec2_alb_asg(vpc_id, subnets, alb_sg_id, ec2_sg_id, key_name,
                      instance_profile_arn, deploy_bucket):
    step("7. EC2 + ALB + ASG")
    ami_id = get_latest_amazon_linux_ami()
    ok(f"AMI selecionada: {ami_id}")

    # --- Target Group ---
    tg_name = 'gamevault-tg'
    tgs = elb.describe_target_groups(Names=[tg_name])['TargetGroups'] \
        if _tg_exists(tg_name) else []

    if tgs:
        tg_arn = tgs[0]['TargetGroupArn']
        skip(f"Target Group '{tg_name}' já existe.")
    else:
        tg = elb.create_target_group(
            Name=tg_name, Protocol='HTTP', Port=8000, VpcId=vpc_id,
            HealthCheckPath='/health', HealthCheckIntervalSeconds=15,
            HealthyThresholdCount=2, UnhealthyThresholdCount=3,
            TargetType='instance',
        )
        tg_arn = tg['TargetGroups'][0]['TargetGroupArn']
        ok(f"Target Group criado: {tg_name}")

    # --- ALB ---
    alb_name = 'gamevault-alb'
    albs = elb.describe_load_balancers(Names=[alb_name])['LoadBalancers'] \
        if _alb_exists(alb_name) else []

    if albs:
        alb_dns = albs[0]['DNSName']
        alb_arn = albs[0]['LoadBalancerArn']
        skip(f"ALB '{alb_name}' já existe: {alb_dns}")
    else:
        alb = elb.create_load_balancer(
            Name=alb_name, Subnets=subnets,
            SecurityGroups=[alb_sg_id], Scheme='internet-facing',
            Type='application', IpAddressType='ipv4',
        )
        alb_arn = alb['LoadBalancers'][0]['LoadBalancerArn']
        alb_dns = alb['LoadBalancers'][0]['DNSName']
        ok(f"ALB criado. Aguardando ficar ativo...", )
        waiter = elb.get_waiter('load_balancer_available')
        waiter.wait(LoadBalancerArns=[alb_arn])
        ok(f"ALB ativo: {alb_dns}")

    # Listener HTTP 80 → Target Group
    listeners = elb.describe_listeners(LoadBalancerArn=alb_arn)['Listeners']
    if not listeners:
        elb.create_listener(
            LoadBalancerArn=alb_arn, Protocol='HTTP', Port=80,
            DefaultActions=[{'Type': 'forward', 'TargetGroupArn': tg_arn}],
        )
        ok("Listener HTTP:80 criado.")
    else:
        skip("Listener já existe.")

    # --- Launch Template ---
    lt_name = 'gamevault-lt'
    lts = ec2.describe_launch_templates(
        Filters=[{'Name': 'launch-template-name', 'Values': [lt_name]}]
    )['LaunchTemplates']

    ud = user_data_script(deploy_bucket)
    lt_data = dict(
        ImageId=ami_id, InstanceType='t2.micro',
        KeyName=key_name, SecurityGroupIds=[ec2_sg_id],
        UserData=ud,
        IamInstanceProfile={'Arn': instance_profile_arn},
    )

    if lts:
        ec2.create_launch_template_version(
            LaunchTemplateName=lt_name, LaunchTemplateData=lt_data)
        skip(f"Launch Template '{lt_name}' atualizado com nova versão.")
        lt_id = lts[0]['LaunchTemplateId']
    else:
        lt = ec2.create_launch_template(
            LaunchTemplateName=lt_name, LaunchTemplateData=lt_data)
        lt_id = lt['LaunchTemplate']['LaunchTemplateId']
        ok(f"Launch Template criado: {lt_id}")

    # --- ASG ---
    asg_name = 'gamevault-asg'
    existing_asg = asg_client.describe_auto_scaling_groups(
        AutoScalingGroupNames=[asg_name])['AutoScalingGroups']

    if existing_asg:
        skip(f"ASG '{asg_name}' já existe.")
        asg_client.update_auto_scaling_group(
            AutoScalingGroupName=asg_name,
            LaunchTemplate={'LaunchTemplateId': lt_id, 'Version': '$Latest'},
        )
        ok("ASG atualizado com novo Launch Template.")
    else:
        asg_client.create_auto_scaling_group(
            AutoScalingGroupName=asg_name,
            LaunchTemplate={'LaunchTemplateId': lt_id, 'Version': '$Latest'},
            MinSize=1, MaxSize=2, DesiredCapacity=1,
            VPCZoneIdentifier=','.join(subnets),
            TargetGroupARNs=[tg_arn],
            HealthCheckType='ELB', HealthCheckGracePeriod=120,
            Tags=[{'Key': 'Name', 'Value': 'gamevault-backend',
                   'PropagateAtLaunch': True, 'ResourceId': asg_name,
                   'ResourceType': 'auto-scaling-group'}],
        )
        ok(f"ASG '{asg_name}' criado (min=1, max=2).")

    return alb_dns


def _tg_exists(name):
    try:
        elb.describe_target_groups(Names=[name])
        return True
    except elb.exceptions.TargetGroupNotFoundException:
        return False


def _alb_exists(name):
    try:
        elb.describe_load_balancers(Names=[name])
        return True
    except elb.exceptions.LoadBalancerNotFoundException:
        return False


# ──────────────────────────────────────────────
# Main
# ──────────────────────────────────────────────

def main():
    print("\n" + "="*50)
    print("  GameVault — Deploy Completo")
    print("="*50)

    account_id = get_account_id()
    ok(f"Conta AWS: {account_id} | Região: {REGION}")

    vpc_id = get_default_vpc()
    subnets = get_public_subnets(vpc_id)
    ok(f"VPC padrão: {vpc_id} | Subnets: {subnets}")

    lambda_role_arn, instance_profile_arn = setup_iam()
    setup_dynamodb()
    setup_lambda(lambda_role_arn)
    deploy_bucket = setup_s3_deploy_bucket(account_id)
    alb_sg_id, ec2_sg_id = setup_security_groups(vpc_id)
    key_name, pem_path = setup_key_pair()

    alb_dns = setup_ec2_alb_asg(
        vpc_id, subnets, alb_sg_id, ec2_sg_id,
        key_name, instance_profile_arn, deploy_bucket,
    )

    frontend_url = setup_s3_frontend_bucket(account_id, alb_dns)

    # Seed do banco
    step("9. Popular banco de dados")
    seed = os.path.join(BACKEND_DIR, 'seed_db.py')
    subprocess.run([sys.executable, seed], check=True)

    print("\n" + "="*50)
    print("  DEPLOY CONCLUÍDO!")
    print("="*50)
    print(f"\n  Frontend : {frontend_url}")
    print(f"  API      : http://{alb_dns}")
    print(f"\n  Login de teste : jogador@email.com / 123456")
    print(f"\n  NOTA: O backend pode levar 1-2 min para iniciar")
    print(f"  (EC2 está baixando dependências via user_data)")
    print()


if __name__ == '__main__':
    main()
