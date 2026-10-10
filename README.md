# tf-aws-demo

Infraestructura en AWS para una web de contenido estático: bucket S3 servido por CloudFront, con el state de Terraform almacenado en un backend remoto en S3.

## Estructura

```
tf-aws-demo/
├── bootstrap/   # crea el bucket S3 del state (state local)
└── frontend/    # bucket S3 de la web + CloudFront (state remoto en S3)
```

## Requisitos

- Terraform `~> 1.16.4`
- AWS CLI con credenciales configuradas
- Permisos para crear buckets S3

## Inicialización del proyecto

El backend remoto necesita que el bucket del state exista antes de usarlo, por eso se crea primero con `bootstrap/` (state local).

### Fase 1: Bootstrap del backend

1. Entrar a la carpeta `bootstrap/`:
   ```bash
   cd bootstrap
   ```
2. Inicializar y aplicar:
   ```bash
   terraform init
   terraform apply
   ```
3. Anotar el nombre del bucket que muestra el output `state_bucket`.
   Tiene el formato `<state_bucket_name>-<account_id>-<region>-an`
   (por defecto `tf-state-aws-static-site-<account_id>-us-east-1-an`).

> El state del bootstrap queda local en `bootstrap/terraform.tfstate` y está excluido del repositorio por `.gitignore`.

### Fase 2: Conectar `frontend/` al backend remoto

1. Editar `frontend/backend.tf` y poner el bucket obtenido en la fase 1:
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
2. Inicializar desde `frontend/`:
   ```bash
   cd ../frontend
   terraform init
   ```
3. Verificar que el state quedó en S3 (tras el primer `terraform apply`):
   ```bash
   aws s3 ls s3://<bucket-del-bootstrap>/frontend/
   ```
