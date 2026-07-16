variable "project_name" {
  description = "Project name prefix for tags and resource names"
  type        = string
}

variable "cluster_name" {
  description = "EKS cluster name"
  type        = string
}

variable "kubernetes_version" {
  description = "EKS control plane Kubernetes version"
  type        = string
  default     = "1.29"
}

variable "private_subnet_ids" {
  description = "Private subnet ids — node group and control plane ENIs live here"
  type        = list(string)
}

variable "public_subnet_ids" {
  description = "Public subnet ids — needed so kubectl from your laptop can reach the public endpoint"
  type        = list(string)
}
