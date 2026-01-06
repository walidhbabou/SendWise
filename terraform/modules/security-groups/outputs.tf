output "master_sg_id" {
  description = "Master node security group ID"
  value       = aws_security_group.master.id
}

output "worker_sg_id" {
  description = "Worker node security group ID"
  value       = aws_security_group.worker.id
}

output "rabbitmq_sg_id" {
  description = "RabbitMQ node security group ID"
  value       = aws_security_group.rabbitmq.id
}
