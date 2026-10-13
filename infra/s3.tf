resource "aws_s3_bucket" "web" {
  bucket           = local.bucket_web_name_account_regional
  bucket_namespace = "account-regional"
  force_destroy    = true # permite destruir el bucket aunque tenga objetos (el dist subido con s3 sync)

  tags = {
    Name = local.bucket_web_name_account_regional
  }
}

resource "aws_s3_bucket_public_access_block" "origin" {
  bucket                  = aws_s3_bucket.web.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_policy" "web" {
  bucket = aws_s3_bucket.web.bucket
  policy = data.aws_iam_policy_document.origin_bucket_policy.json
}