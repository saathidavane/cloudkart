variable "aws_region" {
  description = "AWS region for all resources"
  type        = string
}

variable "project_name" {
  description = "Short project name, used as a prefix on every resource"
  type        = string
}

variable "cluster_name" {
  description = "EKS cluster name"
  type        = string
}

variable "kubernetes_version" {
  description = "EKS control plane Kubernetes version"
  type        = string
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
}

variable "public_subnets" {
  description = "Public subnets: key -> {cidr, az}"
  type = map(object({
    cidr = string
    az   = string
  }))
}

variable "private_subnets" {
  description = "Private subnets: key -> {cidr, az}"
  type = map(object({
    cidr = string
    az   = string
  }))
}

variable "domain_name" {
  description = "Root domain already hosted in Route 53"
  type        = string
}

variable "app_subdomain" {
  description = "Full subdomain the app is served on"
  type        = string
}

variable "service_names" {
  description = "Microservices that need their own ECR repository"
  type        = list(string)
}

variable "cf_origin_secret" {
  description = "Secret header value CloudFront sends to the ALB so the ALB can reject direct traffic that skips CloudFront"
  type        = string
  sensitive   = true
}

variable "db_deletion_protection" {
  description = "RDS deletion protection. Set to false only right before running terraform destroy"
  type        = bool
}

variable "db_multi_az" {
  description = "Whether RDS runs Multi-AZ (extra cost, real HA). false for learning, true for real production"
  type        = bool
}
