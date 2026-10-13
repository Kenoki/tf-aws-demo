# tf-aws-demo

Web estática en AWS: una app Angular servida desde un bucket S3 privado detrás de CloudFront (con Origin Access Control), publicada en un subdominio propio con certificado ACM.

El dominio raíz se gestiona en Cloudflare y el subdominio se delega a una hosted zone de Route 53. La infraestructura se define con Terraform y su state se guarda en un backend remoto en S3.

```
Usuario ──► app.midominio.com (Cloudflare: registros NS ──► Route 53)
                  │
                  ▼
            Route 53 (alias A) ──► CloudFront (ACM, HTTPS) ──► S3 privado (OAC)
```

## Estructura

```
tf-aws-demo/
├── app/                 # App Angular (Tailwind + Vitest)
│   ├── src/
│   └── dist/app/browser # build de producción (generado, ignorado por git)
├── infra/               # Terraform: web + CloudFront + DNS (state remoto en S3)
│   ├── backend.tf       # backend S3 del state
│   ├── provider.tf      # providers: aws (y alias us_east_1) y cloudflare
│   ├── variables.tf     # variables: bucket, dominio, subdominio y token de Cloudflare
│   ├── locals.tf        # nombres derivados (bucket, origin id, fqdn)
│   ├── data.tf          # account/region, policy del bucket, cache policy y zona de Cloudflare
│   ├── s3.tf            # bucket de la web, bloqueo de acceso público y policy
│   ├── cloudfront.tf    # OAC y distribución CloudFront
│   ├── dns.tf           # hosted zone, delegación en Cloudflare, certificado ACM y alias A
│   ├── main.tf          # solo código comentado (versión anterior de ACM/Route53, reemplazada por dns.tf)
│   ├── outputs.tf       # outputs: bucket, CloudFront, URL, name servers e invalidación
│   └── bootstrap/       # crea el bucket S3 del state (state local)
└── modules/             # reservado para módulos (vacío por ahora)
```

> `infra/bootstrap/` está dentro de `infra/` pero es una configuración independiente: Terraform no recorre subdirectorios, así que cada una se inicializa y aplica por separado.

## Requisitos

- Terraform `~> 1.16.4`
- AWS CLI con credenciales y región configuradas (`aws configure` o `AWS_REGION`). El provider `aws` por defecto toma la región de ahí, y de ella depende el nombre del bucket de la web.
- Permisos para crear buckets S3, distribuciones CloudFront, hosted zones de Route 53 y certificados ACM
- Un dominio con su zona DNS en Cloudflare
- Un API token de Cloudflare con permiso `Zone:DNS:Edit` sobre esa zona
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
   cd ..
   terraform init
   ```

### Fase 3: Configurar variables

| Variable | Descripción | Sensible |
| --- | --- | --- |
| `web_bucket_name` | Prefijo del bucket de la web (por defecto `web-aws-static-site`) | no |
| `domain_name` | Dominio raíz gestionado en Cloudflare, ej. `midominio.com` | no |
| `subdomain` | Subdominio que se delega a Route 53, ej. `app` | no |
| `cloudflare_api_token` | API token de Cloudflare con `Zone:DNS:Edit` | sí |

`domain_name`, `subdomain` y `cloudflare_api_token` no tienen valor por defecto. Los dos primeros van en `infra/terraform.tfvars` (excluido del repo por `.gitignore`):

```hcl
domain_name = "midominio.com"
subdomain   = "app"
```

El token se pasa por variable de entorno para no dejarlo en disco:

```bash
export TF_VAR_cloudflare_api_token="<token>"
```

Con eso la web queda en `https://<subdomain>.<domain_name>`.

### Fase 4: Desplegar bucket, CloudFront y DNS

Desde `infra/`:

```bash
terraform plan
terraform apply
```

Qué crea, en orden de dependencia:

1. Hosted zone de Route 53 para `<subdomain>.<domain_name>`.
2. 4 registros NS en Cloudflare que delegan el subdominio a esa hosted zone.
3. Certificado ACM en `us-east-1` validado por DNS (los registros de validación van en Route 53).
4. Bucket S3 privado y distribución CloudFront con el certificado y el alias.
5. Registro A (alias) en Route 53 hacia CloudFront.

> La validación del certificado depende de que la delegación NS ya se haya propagado, por lo que el primer `apply` puede tardar varios minutos en `aws_acm_certificate_validation`.

Verificar que el state quedó en S3:

```bash
aws s3 ls s3://<bucket-del-bootstrap>/frontend/
```

Outputs disponibles (`terraform output` desde `infra/`):

| Output | Descripción |
| --- | --- |
| `s3_web_bucket` | Nombre del bucket de la web, formato `<web_bucket_name>-<account_id>-<region>-an` (por defecto `web-aws-static-site-<account_id>-us-east-1-an`) |
| `cloudfront_domain_name` | Dominio de CloudFront (`<id>.cloudfront.net`) |
| `cloudfront_distribution_id` | ID de la distribución CloudFront |
| `cmd_cf_invalidation` | Comando `aws cloudfront create-invalidation` ya armado con el ID de la distribución |
| `url` | URL pública de la web (`https://<subdomain>.<domain_name>`) |
| `name_servers` | NS de la hosted zone; deben coincidir con los registros NS creados en Cloudflare |

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

### 3. Invalidar la caché de CloudFront

La distribución usa la cache policy administrada `Managed-CachingOptimized` (TTL por defecto de 24 horas), así que sin invalidar, `index.html` puede tardar en reflejar el nuevo build. Ejecutar el comando que entrega el output `cmd_cf_invalidation` (desde `app/`):

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
terraform -chdir=../infra output -raw url
```

## Notas

- El bucket de la web es privado: solo CloudFront puede leerlo (policy con `AWS:SourceArn` de la distribución) y tiene `prevent_destroy`, por lo que `terraform destroy` falla mientras no se quite ese bloque.
- CloudFront redirige HTTP a HTTPS y usa TLS `TLSv1.2_2021` con SNI.
- Los errores 403/404 de CloudFront responden con `/index.html` (200) para soportar el routing de Angular.
- El certificado ACM debe estar en `us-east-1` para CloudFront; por eso el provider `aws` tiene el alias `us_east_1`.
- El token de Cloudflare es sensible: no lo guardes en `terraform.tfvars` ni lo subas al repo.
