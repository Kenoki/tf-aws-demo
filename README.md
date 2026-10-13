# tf-aws-demo

Web estática en AWS: una app Angular servida desde un bucket S3 privado detrás de CloudFront (con Origin Access Control). La infraestructura se define con Terraform y su state se guarda en un backend remoto en S3.

## Estructura

```
tf-aws-demo/
├── app/                 # App Angular (Tailwind + Vitest)
│   ├── src/
│   └── dist/app/browser # build de producción (generado, ignorado por git)
├── infra/               # Terraform: bucket S3 de la web + CloudFront (state remoto en S3)
│   ├── backend.tf       # backend S3 del state
│   ├── provider.tf      # versiones de Terraform/provider y región
│   ├── variables.tf     # variables (nombre del bucket de la web)
│   ├── locals.tf        # nombres derivados
│   ├── data.tf          # account/region y policy del bucket para CloudFront
│   ├── s3.tf            # bucket de la web, bloqueo de acceso público y policy
│   ├── cloudfront.tf    # OAC y distribución CloudFront
│   ├── main.tf          # (comentado) certificado ACM y registros Route53
│   ├── outputs.tf       # outputs: bucket, dominio/ID de CloudFront y comando de invalidación
│   └── bootstrap/       # crea el bucket S3 del state (state local)
└── modules/             # reservado para módulos (vacío por ahora)
```

> `infra/bootstrap/` está dentro de `infra/` pero es una configuración independiente: Terraform no recorre subdirectorios, así que cada una se inicializa y aplica por separado.

## Requisitos

- Terraform `~> 1.16.4`
- AWS CLI con credenciales configuradas
- Permisos para crear buckets S3 y distribuciones CloudFront
- Node.js y npm (para construir la app Angular)

## Inicialización de la infraestructura

El backend remoto necesita que el bucket del state exista antes de usarlo, por eso se crea primero con `infra/bootstrap/` (state local).

### Fase 1: Bootstrap del backend

1. Entrar a `infra/bootstrap/`:
   ```bash
   cd infra/bootstrap
   ```
2. Inicializar y aplicar:
   ```bash
   terraform init
   terraform apply
   ```
3. Anotar el nombre del bucket que muestra el output `state_bucket`.
   Tiene el formato `<state_bucket_name>-<account_id>-<region>-an`
   (por defecto `tf-state-aws-static-site-<account_id>-us-east-1-an`).

> El state del bootstrap queda local en `infra/bootstrap/terraform.tfstate` y está excluido del repositorio por `.gitignore`.

### Fase 2: Conectar `infra/` al backend remoto

1. Editar `infra/backend.tf` y poner el bucket obtenido en la fase 1:
   ```hcl
   terraform {
     backend "s3" {
       bucket       = "<bucket-del-bootstrap>"
       key          = "frontend/terraform.tfstate"
       region       = "us-east-1"
       use_lockfile = true
     }
   }
   ```
2. Inicializar desde `infra/`:
   ```bash
   cd ../
   terraform init
   ```

### Fase 3: Desplegar bucket y CloudFront

Desde `infra/`:

```bash
terraform plan
terraform apply
```

Verificar que el state quedó en S3:

```bash
aws s3 ls s3://<bucket-del-bootstrap>/frontend/
```

Outputs disponibles (`terraform output` desde `infra/`):

| Output | Descripción |
| --- | --- |
| `s3_web_bucket` | Nombre del bucket de la web, formato `<web_bucket_name>-<account_id>-<region>-an` (por defecto `web-aws-static-site-<account_id>-us-east-1-an`) |
| `cloudfront_domain_name` | Dominio de CloudFront (`<id>.cloudfront.net`), la URL pública de la web |
| `cloudfront_distribution_id` | ID de la distribución CloudFront |
| `cmd_cf_invalidation` | Comando `aws cloudfront create-invalidation` ya armado con el ID de la distribución |

## Despliegue de la app

### 1. Construir la app

```bash
cd app
npm ci
npm run build
```

El build de producción queda en `app/dist/app/browser`.

### 2. Subir el `dist` al bucket S3

Desde `app/`, sincronizar el build con el bucket de la web (el nombre se lee del output de Terraform):

```bash
aws s3 sync dist/app/browser s3://$(terraform -chdir=../infra output -raw s3_web_bucket) --delete
```

O indicando el bucket directamente:

```bash
aws s3 sync dist/app/browser s3://<bucket-web> --delete
```

`--delete` elimina del bucket los archivos que ya no existen en el build (los bundles de Angular llevan hash en el nombre, así que cada build deja archivos viejos). Quitarlo si el bucket guarda otros archivos.

### 3. Invalidar la caché de CloudFront (opcional)

El contenido se cachea hasta 1 hora (`default_ttl = 3600`). Para ver el cambio de inmediato, ejecutar el comando que entrega el output `cmd_cf_invalidation` (desde `app/`):

```bash
eval "$(terraform -chdir=../infra output -raw cmd_cf_invalidation)"
```

Equivale a:

```bash
aws cloudfront create-invalidation --distribution-id <distribution-id> --paths '/'
```

El ID sale del output `cloudfront_distribution_id`. Ese comando invalida solo la ruta `/`; para invalidar todo el contenido usar `--paths '/*'`.

### 4. Abrir la web

```bash
terraform -chdir=../infra output -raw cloudfront_domain_name
```

La web queda disponible en `https://<cloudfront_domain_name>`.

## Notas

- El bucket de la web es privado: solo CloudFront puede leerlo (policy con `AWS:SourceArn` de la distribución).
- Los errores 403/404 de CloudFront responden con `/index.html` (200) para soportar el routing de Angular.
- La distribución usa el certificado por defecto de CloudFront (`*.cloudfront.net`); el dominio propio y Route53 están comentados en `infra/main.tf`.
