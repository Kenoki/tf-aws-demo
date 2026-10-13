output "s3_web_bucket" {
  value = aws_s3_bucket.web.bucket
}

output "cloudfront_domain_name" {
  value = aws_cloudfront_distribution.s3_distribution.domain_name
}

output "cloudfront_distribution_id" {
  value = aws_cloudfront_distribution.s3_distribution.id
}

output "cmd_cf_invalidation" {
  value = "aws cloudfront create-invalidation --distribution-id ${aws_cloudfront_distribution.s3_distribution.id} --paths '/'"
}

output "url" {
  value = "https://${local.fqdn}"
}

output "name_servers" {
  description = "NS de la hosted zone; deben coincidir con los registros NS creados en Cloudflare"
  value       = aws_route53_zone.sub.name_servers
}

