# Empacota o backend para envio à EC2
# Gera backend.zip na pasta deploy/

$BACKEND_DIR = "..\backend"
$OUT = "backend.zip"

if (Test-Path $OUT) { Remove-Item $OUT }

# Arquivos a incluir (exclui venv e db)
$files = @("main.py", "database.py", "models.py", "seed_db.py", "requirements.txt", ".env", "lambda_function.py")

$tempDir = ".\backend_temp"
if (Test-Path $tempDir) { Remove-Item $tempDir -Recurse }
New-Item -ItemType Directory $tempDir | Out-Null

foreach ($f in $files) {
    $src = Join-Path $BACKEND_DIR $f
    if (Test-Path $src) {
        Copy-Item $src $tempDir
        Write-Host "  + $f"
    }
}

Compress-Archive -Path "$tempDir\*" -DestinationPath $OUT
Remove-Item $tempDir -Recurse

Write-Host "`nGerado: $OUT" -ForegroundColor Green
Write-Host "Envie para a EC2 com o comando SCP mostrado no guia."
