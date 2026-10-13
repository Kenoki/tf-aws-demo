export type RoadmapStatus = 'hecho' | 'siguiente' | 'idea';

export interface RoadmapItem {
  title: string;
  detail: string;
  status: RoadmapStatus;
}

export const STATUS_LABEL: Record<RoadmapStatus, string> = {
  hecho: 'Hecho',
  siguiente: 'Siguiente',
  idea: 'Idea',
};

export const ROADMAP: readonly RoadmapItem[] = [
  {
    title: 'Sitio privado con CDN y HTTPS',
    detail: 'S3 sin acceso público, CloudFront con OAC y certificado de ACM.',
    status: 'hecho',
  },
  {
    title: 'State remoto con bootstrap',
    detail: 'Bucket de state en S3 con lockfile, creado en una fase aparte.',
    status: 'hecho',
  },
  {
    title: 'DNS elegible por variable',
    detail: 'Delegar a Route 53 o resolver todo en Cloudflare sin cambiar el resto.',
    status: 'hecho',
  },
  {
    title: 'Documentación bilingüe y diagramas',
    detail: 'README en español e inglés, con diagramas de arquitectura y de orden de creación.',
    status: 'hecho',
  },
  {
    title: 'Módulos reutilizables',
    detail: 'Separar sitio estático, CloudFront y DNS en módulos de Terraform.',
    status: 'siguiente',
  },
  {
    title: 'CI/CD',
    detail: 'terraform plan en cada pull request y despliegue automático de la app.',
    status: 'siguiente',
  },
  {
    title: 'Cabeceras de seguridad',
    detail: 'Response headers policy en CloudFront (HSTS, CSP y similares).',
    status: 'idea',
  },
  {
    title: 'Entornos separados',
    detail: 'Workspaces o carpetas por entorno, dev y prod.',
    status: 'idea',
  },
  {
    title: 'Backend serverless',
    detail: 'Formulario de contacto o contador de visitas con API Gateway y Lambda.',
    status: 'idea',
  },
];
