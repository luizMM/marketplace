# Script PowerShell para fazer deploy do frontend no S3
# Rodar APÓS configurar as credenciais AWS Academy no terminal
# Uso: .\deploy_frontend.ps1 -EC2_IP "SEU_IP_EC2" -BUCKET_NAME "seu-bucket-gamevault"

param(
    [Parameter(Mandatory=$true)]
    [string]$EC2_IP,

    [Parameter(Mandatory=$true)]
    [string]$BUCKET_NAME
)

$FRONTEND_DIR = "..\frontend"
$REGION = "us-east-1"

Write-Host "=== Configurando VITE_API_URL ===" -ForegroundColor Cyan
$envContent = "VITE_API_URL=http://$EC2_IP`:8000`n"
Set-Content -Path "$FRONTEND_DIR\.env" -Value $envContent
Write-Host "API URL configurada: http://$EC2_IP`:8000"

Write-Host "`n=== Buildando frontend ===" -ForegroundColor Cyan
Set-Location $FRONTEND_DIR
npm run build
if ($LASTEXITCODE -ne 0) { Write-Host "Erro no build!" -ForegroundColor Red; exit 1 }
Set-Location ..\deploy

Write-Host "`n=== Criando bucket S3 ===" -ForegroundColor Cyan
aws s3 mb "s3://$BUCKET_NAME" --region $REGION 2>&1
aws s3api put-public-access-block `
    --bucket $BUCKET_NAME `
    --public-access-block-configuration "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"

Write-Host "`n=== Configurando hospedagem estática ===" -ForegroundColor Cyan
aws s3 website "s3://$BUCKET_NAME" --index-document index.html --error-document index.html

$policy = @"
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::$BUCKET_NAME/*"
        }
    ]
}
"@
$policy | Out-File -FilePath "bucket-policy.json" -Encoding utf8
aws s3api put-bucket-policy --bucket $BUCKET_NAME --policy file://bucket-policy.json
Remove-Item "bucket-policy.json"

Write-Host "`n=== Fazendo upload dos arquivos ===" -ForegroundColor Cyan
aws s3 sync "$FRONTEND_DIR\dist" "s3://$BUCKET_NAME" --delete

Write-Host "`n=== Deploy concluido! ===" -ForegroundColor Green
Write-Host "Frontend URL: http://$BUCKET_NAME.s3-website-$REGION.amazonaws.com" -ForegroundColor Yellow
Write-Host "Backend URL:  http://$EC2_IP`:8000" -ForegroundColor Yellow
