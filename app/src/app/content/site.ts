export const SITE = {
  name: 'tf-aws-demo',
  repoUrl: 'https://github.com/Kenoki/tf-aws-demo',
  tagline: 'Sitio estático en AWS, definido con Terraform',
  lead:
    'Esta web se sirve desde un bucket S3 privado detrás de CloudFront, con certificado de ACM y el ' +
    'DNS de un subdominio delegado desde Cloudflare. Todo lo que ves está creado con Terraform.',
} as const;

export interface NavLink {
  path: string;
  label: string;
}

export const NAV_LINKS: readonly NavLink[] = [
  { path: '/', label: 'Inicio' },
  { path: '/arquitectura', label: 'Arquitectura' },
  { path: '/despliegue', label: 'Despliegue' },
  { path: '/roadmap', label: 'Roadmap' },
];
