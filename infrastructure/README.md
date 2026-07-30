# EcoDry AWS deployment

This infrastructure deploys the TanStack Start server bundle to a private AWS Lambda Function URL behind CloudFront. Browser assets are stored in a separate private S3 bucket and read only through CloudFront OAC. This matches the existing SSR build; S3 alone cannot run `dist/server/server.js`.

## One-time prerequisites

1. Install AWS CLI, Terraform >= 1.6, Node.js 22, and configure AWS credentials for the target account.
2. Create a private, versioned S3 bucket for Terraform state and a DynamoDB table with a string partition key named `LockID`. These bootstrap resources are deliberately outside this stack so Terraform can safely use them as its backend.
3. Copy `backend.hcl.example` to `backend.hcl` and set the state bucket and lock table. Copy `terraform.tfvars.example` to `terraform.tfvars` and set a globally unique `bucket_name`.
4. To use a Cloudflare-managed subdomain, set `domain_name` in `terraform.tfvars`. The Cloudflare steps are below.

## Deploy

Without a custom domain:

```powershell
cd infrastructure
.\scripts\Build-AwsPackage.ps1
terraform init -backend-config=backend.hcl
terraform plan -out tfplan
terraform apply tfplan
$bucket = terraform output -raw assets_bucket_name
.\scripts\Deploy-Assets.ps1 -BucketName $bucket
```

Use `terraform output -raw website_url` to open the site. CloudFront changes can take several minutes to propagate. A later release is the same build, `terraform apply` (to update Lambda), and asset-upload sequence.

## Cloudflare subdomain

Set `domain_name = "app.example.com"` (replace it with your chosen subdomain), then first create only the ACM certificate:

```powershell
terraform apply -target=aws_acm_certificate.website
terraform output acm_dns_validation_records
```

In Cloudflare DNS, create the displayed ACM validation CNAME record exactly as shown. It **must be DNS only** (grey cloud) and must not be flattened. Wait until the certificate status shows `Issued` in ACM, then run the normal deploy commands above.

After the full apply, create this second Cloudflare DNS record:

| Type | Name | Target | Proxy |
| --- | --- | --- | --- |
| CNAME | `app` | `terraform output -raw cloudfront_domain` | DNS only (grey cloud) |

Keep the CloudFront CNAME DNS-only: proxying one CDN through another can cause TLS, caching, and routing conflicts. The CloudFront distribution already supplies HTTPS and WAF protection.

## Security and operations included

- CloudFront WAF common managed rules and per-IP rate limiting
- TLS-only viewer access; optional Route 53 custom domain and ACM certificate
- Private, encrypted, versioned S3 assets and CloudFront OAC
- Signed CloudFront-to-Lambda Function URL access
- CloudFront access logs retained for 90 days and Lambda logs in CloudWatch
- Remote encrypted Terraform state and DynamoDB state locking (configured by you)

Do not commit `backend.hcl`, `terraform.tfvars` with production values, `.build`, or Terraform state.
