export interface Command {
  title: string;
  description: string;
  code: string;
}

export const DEPLOY_COMMANDS: readonly Command[] = [
  {
    title: 'Construir la app',
    description: 'Genera el build de producción en app/dist/app/browser.',
    code: 'cd app\nnpm ci\nnpm run build',
  },
  {
    title: 'Subir el dist al bucket',
    description:
      'El nombre del bucket se lee del output s3_web_bucket. --delete elimina los archivos que ya no existen en el build.',
    code: 'aws s3 sync dist/app/browser s3://$(terraform -chdir=../infra output -raw s3_web_bucket) --delete',
  },
  {
    title: 'Invalidar la caché de CloudFront',
    description:
      'Ejecuta el comando que entrega el output cmd_cf_invalidation, ya armado con el ID de la distribución.',
    code: 'eval "$(terraform -chdir=../infra output -raw cmd_cf_invalidation)"',
  },
  {
    title: 'Abrir la web',
    description: 'Imprime la URL pública del sitio.',
    code: 'terraform -chdir=../infra output -raw url',
  },
];
