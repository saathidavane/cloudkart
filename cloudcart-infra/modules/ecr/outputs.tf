output "repository_urls" {
  description = "Map of service name -> ECR repository URL, used when pushing images in Phase 10"
  value       = { for k, v in aws_ecr_repository.repos : k => v.repository_url }
}

output "repository_arns" {
  value = { for k, v in aws_ecr_repository.repos : k => v.arn }
}
