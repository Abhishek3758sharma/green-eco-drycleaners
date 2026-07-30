output "assets_bucket_name" { value = aws_s3_bucket.assets.bucket }
output "cloudfront_distribution_id" { value = aws_cloudfront_distribution.website.id }
output "cloudfront_domain" { value = aws_cloudfront_distribution.website.domain_name }
output "website_url" { value = local.has_custom_domain ? "https://${var.domain_name}" : "https://${aws_cloudfront_distribution.website.domain_name}" }

output "acm_dns_validation_records" {
  description = "Create these DNS-only CNAME records in Cloudflare, then wait for ACM to issue the certificate before the full apply."
  value = local.has_custom_domain ? {
    for dvo in aws_acm_certificate.website[0].domain_validation_options : dvo.domain_name => {
      name  = dvo.resource_record_name
      type  = dvo.resource_record_type
      value = dvo.resource_record_value
    }
  } : {}
}
