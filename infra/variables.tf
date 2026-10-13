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

variable "dns_delegated_by" {
  description = "Proveedor DNS donde se gestiona el dominio raíz"
  type        = string
  validation {
    condition     = contains(["cloudflare", "route53"], var.dns_delegated_by)
    error_message = "dns_selected debe ser cloudflare o route53."
  }
}
