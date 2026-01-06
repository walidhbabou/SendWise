variable "environment" {
  description = "Environment name"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID"
  type        = string
}

variable "public_subnet_id" {
  description = "Public subnet ID"
  type        = string
}

variable "key_pair_name" {
  description = "EC2 Key Pair name"
  type        = string
}

variable "master_sg_id" {
  description = "Master node security group ID"
  type        = string
}

variable "worker_sg_id" {
  description = "Worker node security group ID"
  type        = string
}

variable "rabbitmq_sg_id" {
  description = "RabbitMQ node security group ID"
  type        = string
}

variable "master_instance_type" {
  description = "Master node instance type"
  type        = string
}

variable "worker_instance_type" {
  description = "Worker node instance type"
  type        = string
}

variable "rabbitmq_instance_type" {
  description = "RabbitMQ node instance type"
  type        = string
}
