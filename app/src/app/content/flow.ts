export interface FlowStep {
  title: string;
  detail: string;
}

export const REQUEST_FLOW: readonly FlowStep[] = [
  {
    title: 'El navegador resuelve el DNS',
    detail:
      'Pregunta por el subdominio. Cloudflare responde con un NS hacia Route 53 o con un CNAME directo a CloudFront, según dns_delegated_by.',
  },
  {
    title: 'CloudFront abre la conexión HTTPS',
    detail:
      'Presenta el certificado de ACM y redirige HTTP a HTTPS. El tráfico real va directo a CloudFront; el DNS solo resuelve el nombre.',
  },
  {
    title: 'CloudFront lee el bucket privado',
    detail:
      'Firma la petición con Origin Access Control. La policy del bucket acepta solo a esta distribución, identificada por su ARN.',
  },
  {
    title: 'La respuesta queda en caché',
    detail:
      'Usa la política administrada CachingOptimized. Por eso, tras subir un build nuevo, hay que invalidar la caché.',
  },
];
