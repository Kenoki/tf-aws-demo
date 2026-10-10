# tf-aws-demo

Infraestructura en AWS para una web de contenido estático: bucket S3 servido por CloudFront, con el state de Terraform almacenado en un backend remoto en S3.

## Requisitos

- Terraform `~> 1.16.5`
- AWS CLI con credenciales configuradas
- Permisos para crear buckets S3

## Inicialización del proyecto

El backend remoto necesita que el bucket del state exista antes de usarlo, por eso se crea primero con el módulo `bootstrap/` (state local).

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
3. Anotar el nombre del bucket que muestra el output (`state_bucket_name`).

> El state del bootstrap queda local en `bootstrap/terraform.tfstate`. No se sube al repositorio.

### Fase 2: Conectar el proyecto al backend remoto

1. En la raíz, crear `backend.tf` con el bucket obtenido en la fase 1:
   ```hcl
   terraform {
     backend "s3" {
       bucket       = "<bucket-del-bootstrap>"
       key          = "aws-demo/terraform.tfstate"
       region       = "us-east-1"
       use_lockfile = true
     }
   }
   ```
2. Volver a la raíz e inicializar:
   ```bash
   cd ..
   terraform init
   ```
3. Verificar que el state quedó en S3:
   ```bash
   aws s3 ls s3://<bucket-del-bootstrap>/networking/
   ```
