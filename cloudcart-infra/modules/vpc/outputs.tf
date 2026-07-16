output "vpc_id" {
  value = aws_vpc.main.id
}

output "public_subnet_ids" {
  description = "Map of public subnets: key -> subnet id"
  value       = { for k, v in aws_subnet.public : k => v.id }
}

output "private_subnet_ids" {
  description = "Map of private subnets: key -> subnet id"
  value       = { for k, v in aws_subnet.private : k => v.id }
}

output "public_subnet_ids_list" {
  description = "Flat list of public subnet ids (order not guaranteed, fine for EKS/ALB)"
  value       = [for s in aws_subnet.public : s.id]
}

output "private_subnet_ids_list" {
  description = "Flat list of private subnet ids (order not guaranteed, fine for EKS/RDS)"
  value       = [for s in aws_subnet.private : s.id]
}

output "alb_security_group_id" {
  value = aws_security_group.alb.id
}

output "eks_nodes_security_group_id" {
  value = aws_security_group.eks_nodes.id
}

output "rds_security_group_id" {
  value = aws_security_group.rds.id
}
