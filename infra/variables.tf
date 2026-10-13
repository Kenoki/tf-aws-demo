variable "web_bucket_name" {
  type        = string
  default     = "web-aws-static-site"
  description = "Nombre para tu S3 Bucket para web"
}

variable "domain_name" {
  description = "Dominio raíz gestionado en Cloudflare, ej: midominio.com"
  type        = string
}

variable "subdomain" {
  description = "Subdominio que se delega a Route 53, ej: app"
  type        = string
}

variable "cloudflare_api_token" {
  description = "API token de Cloudflare con permiso Zone:DNS:Edit sobre la zona"
  type        = string
  sensitive   = true
}