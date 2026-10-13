export interface Service {
  id: string;
  name: string;
  role: string;
  description: string;
  /** Recursos de Terraform que lo crean. */
  terraform: readonly string[];
  /** Ruta del ícono oficial de AWS; los servicios de terceros no llevan. */
  icon?: string;
}

export const SERVICES: readonly Service[] = [
  {
    id: 's3',
    name: 'Amazon S3',
    role: 'Origen privado',
    description:
      'Guarda el build de Angular. El bucket bloquea todo acceso público y solo CloudFront puede leerlo.',
    terraform: [
      'aws_s3_bucket',
      'aws_s3_bucket_public_access_block',
      'aws_s3_bucket_policy',
    ],
    icon: 'icons/s3.svg',
  },
  {
    id: 'cloudfront',
    name: 'Amazon CloudFront',
    role: 'CDN y HTTPS',
    description:
      'Redirige HTTP a HTTPS, exige TLS 1.2 y responde los errores 403/404 con index.html para que el routing de Angular funcione.',
    terraform: ['aws_cloudfront_distribution', 'aws_cloudfront_origin_access_control'],
    icon: 'icons/cloudfront.svg',
  },
  {
    id: 'acm',
    name: 'AWS Certificate Manager',
    role: 'Certificado TLS',
    description:
      'Emite el certificado del subdominio y lo valida por DNS. Debe estar en us-east-1 para poder usarlo con CloudFront.',
    terraform: ['aws_acm_certificate', 'aws_acm_certificate_validation'],
    icon: 'icons/acm.svg',
  },
  {
    id: 'route53',
    name: 'Amazon Route 53',
    role: 'DNS del subdominio',
    description:
      'En el modo route53 recibe la delegación NS y publica el alias A hacia CloudFront. En el modo cloudflare no se usa.',
    terraform: ['aws_route53_zone', 'aws_route53_record'],
    icon: 'icons/route53.svg',
  },
  {
    id: 'cloudflare',
    name: 'Cloudflare',
    role: 'DNS del dominio raíz',
    description:
      'Aloja la zona del dominio. Delega el subdominio a Route 53 con registros NS o lo apunta con un CNAME en modo DNS only.',
    terraform: ['cloudflare_dns_record', 'data.cloudflare_zone'],
  },
  {
    id: 'terraform',
    name: 'Terraform',
    role: 'Infraestructura como código',
    description:
      'Define y versiona todo lo anterior. El state vive en S3 con lockfile y la variable dns_delegated_by elige el modo de DNS.',
    terraform: ['backend "s3"', 'variable "dns_delegated_by"'],
  },
];
