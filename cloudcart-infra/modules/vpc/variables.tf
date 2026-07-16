variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
}

variable "project_name" {
  description = "Project name prefix for tags and resource names"
  type        = string
}

variable "cluster_name" {
  description = "EKS cluster name, used in required subnet discovery tags"
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
