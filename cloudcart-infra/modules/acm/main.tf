# Request the certificate
resource "aws_acm_certificate" "main" {
  domain_name       = var.app_subdomain # cloudcart.sathidavane.xyz
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}

# Get the Route 53 hosted zone
data "aws_route53_zone" "main" {
  name         = var.domain_name # sathidavane.xyz
  private_zone = false
}

# Create the DNS validation CNAME record
resource "aws_route53_record" "cert_validation" {
  for_each = {
    for dvo in aws_acm_certificate.main.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      type   = dvo.resource_record_type
      record = dvo.resource_record_value
    }
  }
  zone_id = data.aws_route53_zone.main.zone_id
  name    = each.value.name
  type    = each.value.type
  ttl     = 60
  records = [each.value.record]
}

# Wait for ACM to validate and issue the certificate
resource "aws_acm_certificate_validation" "main" {
  certificate_arn         = aws_acm_certificate.main.arn
  validation_record_fqdns = [for r in aws_route53_record.cert_validation : r.fqdn]
}
