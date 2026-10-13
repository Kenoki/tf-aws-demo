resource "aws_route53_zone" "sub" {
  name = local.fqdn
}

# Route 53 asigna siempre 4 name servers. Se usa count porque sus valores
# se conocen recién al aplicar y for_each necesita las claves en el plan.
resource "cloudflare_dns_record" "delegation" {
  count = 4

  zone_id = data.cloudflare_zone.this.id
  name    = var.subdomain
  type    = "NS"
  content = aws_route53_zone.sub.name_servers[count.index]
  ttl     = 3600
}

resource "aws_acm_certificate" "this" {
  provider          = aws.us_east_1
  domain_name       = local.fqdn
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route53_record" "acm_validation" {
  for_each = {
    for dvo in aws_acm_certificate.this.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      type   = dvo.resource_record_type
      record = dvo.resource_record_value
    }
  }

  zone_id         = aws_route53_zone.sub.zone_id
  name            = each.value.name
  type            = each.value.type
  records         = [each.value.record]
  ttl             = 60
  allow_overwrite = true
}

resource "aws_acm_certificate_validation" "this" {
  provider                = aws.us_east_1
  certificate_arn         = aws_acm_certificate.this.arn
  validation_record_fqdns = [for r in aws_route53_record.acm_validation : r.fqdn]

  # ACM valida contra el DNS público: la delegación debe existir antes
  depends_on = [cloudflare_dns_record.delegation]
}

resource "aws_route53_record" "web" {
  zone_id = aws_route53_zone.sub.zone_id
  name    = local.fqdn
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.s3_distribution.domain_name
    zone_id                = aws_cloudfront_distribution.s3_distribution.hosted_zone_id
    evaluate_target_health = false
  }
}