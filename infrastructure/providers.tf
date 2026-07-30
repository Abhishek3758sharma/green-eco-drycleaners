terraform {
  required_version = ">= 1.6.0"

  backend "s3" {}

  required_providers {
    archive = { source = "hashicorp/archive", version = "~> 2.7" }
    aws     = { source = "hashicorp/aws", version = "~> 6.0" }
  }
}

provider "aws" {
  region = var.aws_region
  default_tags {
    tags = {
      Project     = var.project
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}

# ACM certificates and CloudFront WAF resources must be managed in us-east-1.
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"
}
