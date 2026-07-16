output "vpc_id" {
  value = module.vpc.vpc_id
}

output "ecr_repository_urls" {
  value = module.ecr.repository_urls
}

output "cluster_name" {
  value = module.eks.cluster_name
}

output "cluster_endpoint" {
  value = module.eks.cluster_endpoint
}

output "lbc_role_arn" {
  description = "Use this in the Helm install command for the AWS Load Balancer Controller (Phase 12)"
  value       = module.iam.lbc_role_arn
}

output "ebs_csi_role_arn" {
  value = module.iam.ebs_csi_role_arn
}

output "rds_endpoint" {
  value = module.rds.rds_endpoint
}

output "certificate_arn" {
  value = module.acm.certificate_arn
}

output "cloudfront_domain_name" {
  value = module.cloudfront.cloudfront_domain_name
}

output "app_url" {
  value = "https://${var.app_subdomain}"
}
