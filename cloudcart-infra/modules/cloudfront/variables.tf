variable "project_name" {
  description = "Project name prefix, also used to match the Ingress stack tag"
  type        = string
}

variable "app_subdomain" {
  description = "The CloudFront alias / custom domain (cloudcart.sathidavane.xyz)"
  type        = string
}

variable "cf_origin_secret" {
  description = "Shared secret header value; add a matching rule on the ALB/ingress to reject requests without it"
  type        = string
  sensitive   = true
}

variable "certificate_arn" {
  description = "ACM certificate ARN (must be in us-east-1), from module.acm.certificate_arn"
  type        = string
}
