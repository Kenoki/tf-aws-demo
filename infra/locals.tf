locals {
  bucket_web_name_account_regional = format("%s-%s-%s-an", var.web_bucket_name, data.aws_caller_identity.current.account_id, data.aws_region.current.region)
  s3_origin_id                     = "web-aws-static-site-s3-origin"
  fqdn                             = "${var.subdomain}.${var.domain_name}"
  my_domain                        = "mydomain.com"
}