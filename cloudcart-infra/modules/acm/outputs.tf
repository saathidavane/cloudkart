output "certificate_arn" {
  description = "Validated certificate ARN — must be in us-east-1 for both ALB and CloudFront"
  value       = aws_acm_certificate_validation.main.certificate_arn
}

output "route53_zone_id" {
  value = data.aws_route53_zone.main.zone_id
}
