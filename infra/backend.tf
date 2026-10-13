terraform {
  backend "s3" {
    bucket       = "tf-state-aws-static-site-402178232853-us-east-1-an"
    key          = "frontend/terraform.tfstate"
    region       = "us-east-1"
    use_lockfile = true
  }
}