variable "project_name" {
  description = "Project name prefix for tags and resource names"
  type        = string
}

variable "private_subnet_ids" {
  description = "Private subnet ids for the DB subnet group"
  type        = list(string)
}

variable "rds_security_group_id" {
  description = "Security group id that allows port 3306 from EKS nodes only"
  type        = string
}

variable "deletion_protection" {
  description = "Prevents accidental terraform destroy. Set to false right before you actually want to destroy the DB"
  type        = bool
  default     = true
}

variable "multi_az" {
  description = "false for learning (cheaper); true for real production HA"
  type        = bool
  default     = false
}
