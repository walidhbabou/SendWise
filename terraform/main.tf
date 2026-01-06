terraform {
  required_version = ">= 1.0"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
  
  default_tags {
    tags = {
      Project     = "CampaignCreator"
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}

# VPC Module
module "vpc" {
  source = "./modules/vpc"
  
  environment         = var.environment
  vpc_cidr            = var.vpc_cidr
  availability_zones  = var.availability_zones
  public_subnet_cidrs = var.public_subnet_cidrs
}

# Security Groups Module
module "security_groups" {
  source = "./modules/security-groups"
  
  environment = var.environment
  vpc_id      = module.vpc.vpc_id
  ssh_cidr    = var.ssh_allowed_cidr
}

# EC2 Instances Module
module "ec2_instances" {
  source = "./modules/ec2"
  
  environment            = var.environment
  vpc_id                 = module.vpc.vpc_id
  public_subnet_id       = module.vpc.public_subnet_ids[0]
  key_pair_name          = var.key_pair_name
  
  master_sg_id           = module.security_groups.master_sg_id
  worker_sg_id           = module.security_groups.worker_sg_id
  rabbitmq_sg_id         = module.security_groups.rabbitmq_sg_id
  
  master_instance_type   = var.master_instance_type
  worker_instance_type   = var.worker_instance_type
  rabbitmq_instance_type = var.rabbitmq_instance_type
}

# Generate Ansible Inventory
resource "local_file" "ansible_inventory" {
  content = templatefile("${path.module}/templates/inventory.tpl", {
    master_ip   = module.ec2_instances.master_public_ip
    worker_ip   = module.ec2_instances.worker_public_ip
    rabbitmq_ip = module.ec2_instances.rabbitmq_public_ip
    key_file    = var.key_pair_name
  })
  filename = "${path.module}/../ansible/inventories/hosts.ini"
}
