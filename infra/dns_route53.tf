resource "aws_route53_zone" "sub" {
  count = local.is_route53 ? 1 : 0
  name  = local.fqdn
}

resource "aws_route53_record" "acm_validation" {
  for_each = local.is_route53 ? {
    for dvo in aws_acm_certificate.this.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      type   = dvo.resource_record_type
      record = dvo.resource_record_value
    }
  } : {}

  zone_id         = aws_route53_zone.sub[0].zone_id
  name            = each.value.name
  type            = each.value.type
  records         = [each.value.record]
  ttl             = 60
  allow_overwrite = true
}

resource "aws_route53_record" "web" {
  count   = local.is_route53 ? 1 : 0
  zone_id = aws_route53_zone.sub[0].zone_id
  name    = local.fqdn
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.s3_distribution.domain_name
    zone_id                = aws_cloudfront_distribution.s3_distribution.hosted_zone_id
    evaluate_target_health = false
  }
}