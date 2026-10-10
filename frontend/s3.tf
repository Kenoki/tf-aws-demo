resource "aws_s3_bucket" "web" {
  bucket           = local.bucket_web_name_account_regional
  bucket_namespace = "account-regional"

  tags = {
    Name = local.bucket_web_name_account_regional
  }
}

resource "aws_s3_bucket_policy" "web" {
  bucket = aws_s3_bucket.web.bucket
  policy = data.aws_iam_policy_document.origin_bucket_policy.json
}