variable "aws_region" {
  type    = string
  default = "ap-south-1"
}

variable "project" {
  type    = string
  default = "ecodry"
}

variable "environment" {
  type    = string
  default = "prod"
}
variable "bucket_name" {
  type        = string
  description = "Globally unique private S3 bucket for browser assets."
}
variable "domain_name" {
  type        = string
  default     = null
  nullable    = true
  description = "Optional public domain, such as www.example.com."
}
variable "cloudfront_price_class" {
  type    = string
  default = "PriceClass_200"
}

variable "log_retention_days" {
  type    = number
  default = 90
}

variable "waf_rate_limit" {
  type    = number
  default = 2000
}
