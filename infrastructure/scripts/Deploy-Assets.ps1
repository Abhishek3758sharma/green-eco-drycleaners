Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"
param([Parameter(Mandatory = $true)][string]$BucketName)

$infraRoot = Split-Path -Parent $PSScriptRoot
$appRoot = Split-Path -Parent $infraRoot
$clientRoot = Join-Path $appRoot "dist\\client"
if (-not (Test-Path $clientRoot)) { throw "Missing dist/client. Run .\\scripts\\Build-AwsPackage.ps1 first." }

# Versioned asset names may be cached for a year. HTML is delivered by Lambda,
# so only the immutable client files are uploaded here.
aws s3 sync $clientRoot "s3://$BucketName" --delete --exclude "*" --include "assets/*" --cache-control "public,max-age=31536000,immutable"
aws s3 cp (Join-Path $clientRoot "robots.txt") "s3://$BucketName/robots.txt" --cache-control "public,max-age=3600" --content-type "text/plain"
aws s3 cp (Join-Path $clientRoot "sitemap.xml") "s3://$BucketName/sitemap.xml" --cache-control "public,max-age=3600" --content-type "application/xml"
Write-Host "Browser assets uploaded to $BucketName"
