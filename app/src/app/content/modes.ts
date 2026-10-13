export type DnsMode = 'route53' | 'cloudflare';

export interface ModeInfo {
  id: DnsMode;
  label: string;
  summary: string;
  /** Recursos de Terraform que existen solo en este modo. */
  resources: readonly string[];
}

/** Recursos que existen en ambos modos. */
export const COMMON_RESOURCES: readonly string[] = [
  'aws_s3_bucket.web',
  'aws_s3_bucket_public_access_block.origin',
  'aws_s3_bucket_policy.web',
  'aws_cloudfront_origin_access_control.default',
  'aws_cloudfront_distribution.s3_distribution',
  'aws_acm_certificate.this',
  'aws_acm_certificate_validation.this',
];

export const MODES: readonly ModeInfo[] = [
  {
    id: 'route53',
    label: 'route53',
    summary:
      'Cloudflare delega el subdominio a Route 53 con 4 registros NS. Route 53 valida el certificado y publica el alias A hacia CloudFront.',
    resources: [
      'aws_route53_zone.sub',
      'cloudflare_dns_record.delegation (×4)',
      'aws_route53_record.acm_validation',
      'aws_route53_record.web',
    ],
  },
  {
    id: 'cloudflare',
    label: 'cloudflare',
    summary:
      'Todo el DNS queda en Cloudflare: los registros de validación de ACM y un CNAME hacia CloudFront, sin proxy (DNS only).',
    resources: ['cloudflare_dns_record.acm_validation', 'cloudflare_dns_record.site'],
  },
];
