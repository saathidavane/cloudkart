variable "domain_name" {
  description = "Root domain already hosted in Route 53 (sathidavane.xyz)"
  type        = string
}

variable "app_subdomain" {
  description = "Full subdomain the certificate is issued for (cloudcart.sathidavane.xyz)"
  type        = string
}
