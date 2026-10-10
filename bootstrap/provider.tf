terraform {
  required_version = "~> 1.16.5"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "6.68.0"
    }
  }
}

provider "aws" {
  region = "us-east-1" # Set the AWS region to US East (N. Virginia)
}