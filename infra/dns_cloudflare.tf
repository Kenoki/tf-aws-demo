# Route 53 asigna siempre 4 name servers. Se usa count porque sus valores
# se conocen recién al aplicar y for_each necesita las claves en el plan.
resource "cloudflare_dns_record" "delegation" {
  count = local.is_route53 ? 4 : 0

  zone_id = data.cloudflare_zone.this.id
  name    = var.subdomain
  type    = "NS"
  content = aws_route53_zone.sub[0].name_servers[count.index]
  ttl     = 3600
}

resource "cloudflare_dns_record" "acm_validation" {
  for_each = local.is_cloudflare ? {
    for dvo in aws_acm_certificate.this.domain_validation_options : dvo.domain_name => {
      name  = dvo.resource_record_name
      type  = dvo.resource_record_type
      value = dvo.resource_record_value
    }
  } : {}

  zone_id = data.cloudflare_zone.this.id
  name    = trimsuffix(each.value.name, ".")
  type    = each.value.type
  content = trimsuffix(each.value.value, ".")
  ttl     = 60
  proxied = false # obligatorio: la validación debe ser DNS only
}

resource "cloudflare_dns_record" "site" {
  count   = local.is_cloudflare ? 1 : 0
  zone_id = data.cloudflare_zone.this.id
  name    = var.subdomain
  type    = "CNAME"
  content = aws_cloudfront_distribution.s3_distribution.domain_name
  ttl     = 1     # 1 = automático
  proxied = false # DNS only: el TLS lo termina CloudFront con el cert de ACM
}