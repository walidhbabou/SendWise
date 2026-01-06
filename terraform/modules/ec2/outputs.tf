output "master_id" {
  description = "Master node instance ID"
  value       = aws_instance.master.id
}

output "master_public_ip" {
  description = "Master node public IP"
  value       = aws_instance.master.public_ip
}

output "master_private_ip" {
  description = "Master node private IP"
  value       = aws_instance.master.private_ip
}

output "worker_id" {
  description = "Worker node instance ID"
  value       = aws_instance.worker.id
}

output "worker_public_ip" {
  description = "Worker node public IP"
  value       = aws_instance.worker.public_ip
}

output "worker_private_ip" {
  description = "Worker node private IP"
  value       = aws_instance.worker.private_ip
}

output "rabbitmq_id" {
  description = "RabbitMQ node instance ID"
  value       = aws_instance.rabbitmq.id
}

output "rabbitmq_public_ip" {
  description = "RabbitMQ node public IP"
  value       = aws_instance.rabbitmq.public_ip
}

output "rabbitmq_private_ip" {
  description = "RabbitMQ node private IP"
  value       = aws_instance.rabbitmq.private_ip
}
