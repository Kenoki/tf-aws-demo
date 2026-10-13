terraform {
  required_version = "~> 1.16.4"

  required_providers {
    aws = {
      source  = "hashicorp/aws" # Specify the source of the AWS provider
      version = "~> 6.68.0"     # Use a version of the AWS provider that is compatible with version
    }

    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "5.27.0"
    }
  }
}

provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1" # Set the AWS region to US East (N. Virginia)
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}