# ---------------------------------------------------------------------------
# Phase 7 — ECR (no dependencies, safe to apply first)
# ---------------------------------------------------------------------------
module "ecr" {
  source = "./modules/ecr"

  project_name  = var.project_name
  service_names = var.service_names
}

# ---------------------------------------------------------------------------
# Phase 8 — VPC, subnets, NAT, security groups
# ---------------------------------------------------------------------------
module "vpc" {
  source = "./modules/vpc"

  vpc_cidr        = var.vpc_cidr
  project_name    = var.project_name
  cluster_name    = var.cluster_name
  public_subnets  = var.public_subnets
  private_subnets = var.private_subnets
}

# ---------------------------------------------------------------------------
# Phase 9 — EKS cluster + node group + OIDC provider
# ---------------------------------------------------------------------------
module "eks" {
  source = "./modules/eks"

  project_name       = var.project_name
  cluster_name       = var.cluster_name
  kubernetes_version = var.kubernetes_version
  private_subnet_ids = module.vpc.private_subnet_ids_list
  public_subnet_ids  = module.vpc.public_subnet_ids_list
}

# IRSA roles for the AWS Load Balancer Controller and EBS CSI Driver.
# Depends on the EKS OIDC provider, so it must come after module.eks.
module "iam" {
  source = "./modules/iam"

  project_name      = var.project_name
  oidc_provider_arn = module.eks.oidc_provider_arn
  oidc_provider_url = module.eks.oidc_provider_url
}

# ---------------------------------------------------------------------------
# Phase 11 — RDS MySQL
# ---------------------------------------------------------------------------
module "rds" {
  source = "./modules/rds"

  project_name          = var.project_name
  private_subnet_ids    = module.vpc.private_subnet_ids_list
  rds_security_group_id = module.vpc.rds_security_group_id
  deletion_protection   = var.db_deletion_protection
  multi_az              = var.db_multi_az
}

# ---------------------------------------------------------------------------
# Phase 13 — ACM certificate + Route 53 validation
# Independent of the ALB, safe to apply any time after the hosted zone exists.
# ---------------------------------------------------------------------------
module "acm" {
  source = "./modules/acm"

  domain_name   = var.domain_name
  app_subdomain = var.app_subdomain
}

# ---------------------------------------------------------------------------
# Phase 14 — CloudFront CDN
# IMPORTANT: this module reads the ALB via a data source (tag
# ingress.k8s.aws/stack). It will fail with "no matching load balancer" until
# you have completed Phase 12 (kubectl apply -f k8s/ingress/ with the ALB
# Controller running). Comment this module block out until then, or use
# `terraform apply -target` as described in the step-by-step commands below.
# ---------------------------------------------------------------------------
module "cloudfront" {
  source = "./modules/cloudfront"

  project_name     = var.project_name
  app_subdomain    = var.app_subdomain
  cf_origin_secret = var.cf_origin_secret
  certificate_arn  = module.acm.certificate_arn
}

# ---------------------------------------------------------------------------
# Route 53 A record — cloudcart.sathidavane.xyz -> CloudFront
# (Phase 13 pointed this at the ALB directly; Phase 14 moves it to CloudFront.
#  This file already reflects the final Phase 14 state.)
# ---------------------------------------------------------------------------
resource "aws_route53_record" "app" {
  zone_id = module.acm.route53_zone_id
  name    = var.app_subdomain
  type    = "A"

  alias {
    name                   = module.cloudfront.cloudfront_domain_name
    zone_id                = module.cloudfront.cloudfront_hosted_zone_id
    evaluate_target_health = false
  }
}
