locals {
  bucket_name_account_regional = format("%s-%s-%s-an", var.state_bucket_name, data.aws_caller_identity.current.account_id, data.aws_region.current.region)
}