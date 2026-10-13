locals {
  bucket_web_name_account_regional = format("%s-%s-%s-an", var.web_bucket_name, data.aws_caller_identity.current.account_id, data.aws_region.current.region)
  s3_origin_id                     = "myS3Origin"
  my_domain                        = "mydomain.com"
}