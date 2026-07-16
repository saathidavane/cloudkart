variable "project_name" {
  description = "Project name prefix, used in the repository name"
  type        = string
}

variable "service_names" {
  description = "One ECR repository is created per service in this list"
  type        = list(string)
}
