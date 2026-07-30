Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$infraRoot = Split-Path -Parent $PSScriptRoot
$appRoot = Split-Path -Parent $infraRoot
$outputRoot = Join-Path $infraRoot ".build\\lambda"
$serverSource = Join-Path $appRoot "dist\\server"

Push-Location $appRoot
try { npm run build } finally { Pop-Location }

if (-not (Test-Path (Join-Path $serverSource "server.js"))) {
  throw "The application build did not produce dist/server/server.js. This deployment requires the TanStack Start server bundle."
}

if (Test-Path $outputRoot) { Remove-Item -LiteralPath $outputRoot -Recurse -Force }
New-Item -ItemType Directory -Path $outputRoot | Out-Null
Copy-Item -LiteralPath (Join-Path $infraRoot "lambda\\index.mjs") -Destination (Join-Path $outputRoot "index.mjs")
Copy-Item -LiteralPath $serverSource -Destination (Join-Path $outputRoot "server") -Recurse
Write-Host "Lambda package prepared at $outputRoot"
