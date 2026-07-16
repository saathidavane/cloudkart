output "rds_endpoint" {
  description = "DB hostname (no port) — use this for DB_HOST in the ConfigMap"
  value       = aws_db_instance.main.address
}

output "rds_port" {
  value = aws_db_instance.main.port
}

output "db_secret_arn" {
  description = "Secrets Manager ARN holding the auto-generated master password"
  value       = aws_secretsmanager_secret.db_password.arn
}
