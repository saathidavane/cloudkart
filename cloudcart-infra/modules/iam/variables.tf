variable "project_name" {
  description = "Project name prefix for tags and resource names"
  type        = string
}

variable "oidc_provider_arn" {
  description = "OIDC provider ARN, from module.eks.oidc_provider_arn"
  type        = string
}

variable "oidc_provider_url" {
  description = "OIDC issuer URL without https://, from module.eks.oidc_provider_url"
  type        = string
}
