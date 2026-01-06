output "master_public_ip" {
  description = "Master node public IP"
  value       = module.ec2_instances.master_public_ip
}

output "worker_public_ip" {
  description = "Worker node public IP"
  value       = module.ec2_instances.worker_public_ip
}

output "rabbitmq_public_ip" {
  description = "RabbitMQ node public IP"
  value       = module.ec2_instances.rabbitmq_public_ip
}

output "jenkins_url" {
  description = "Jenkins URL"
  value       = "http://${module.ec2_instances.master_public_ip}:8080"
}

output "application_url" {
  description = "Application URL"
  value       = "http://${module.ec2_instances.worker_public_ip}:3000"
}

output "rabbitmq_url" {
  description = "RabbitMQ Management URL"
  value       = "http://${module.ec2_instances.rabbitmq_public_ip}:15672"
}

output "grafana_url" {
  description = "Grafana URL"
  value       = "http://${module.ec2_instances.rabbitmq_public_ip}:3001"
}

output "prometheus_url" {
  description = "Prometheus URL"
  value       = "http://${module.ec2_instances.rabbitmq_public_ip}:9090"
}

output "ssh_commands" {
  description = "SSH commands to connect to instances"
  value = {
    master   = "ssh -i ~/.ssh/${var.key_pair_name}.pem ubuntu@${module.ec2_instances.master_public_ip}"
    worker   = "ssh -i ~/.ssh/${var.key_pair_name}.pem ubuntu@${module.ec2_instances.worker_public_ip}"
    rabbitmq = "ssh -i ~/.ssh/${var.key_pair_name}.pem ubuntu@${module.ec2_instances.rabbitmq_public_ip}"
  }
}

output "vpc_id" {
  description = "VPC ID"
  value       = module.vpc.vpc_id
}
