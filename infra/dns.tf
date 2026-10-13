resource "aws_acm_certificate" "this" {
  provider          = aws.us_east_1
  domain_name       = local.fqdn
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_acm_certificate_validation" "this" {
  provider                = aws.us_east_1
  certificate_arn         = aws_acm_certificate.this.arn
  validation_record_fqdns = local.is_route53 ? [for r in aws_route53_record.acm_validation : r.fqdn] : null

  # ACM valida contra el DNS público: los registros de validación (y la
  # delegación NS, si aplica) deben existir antes
  depends_on = [
    cloudflare_dns_record.delegation,
    cloudflare_dns_record.acm_validation,
  ]
}