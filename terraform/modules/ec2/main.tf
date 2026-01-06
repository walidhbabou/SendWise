data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# Master Node (Jenkins)
resource "aws_instance" "master" {
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = var.master_instance_type
  key_name               = var.key_pair_name
  subnet_id              = var.public_subnet_id
  vpc_security_group_ids = [var.master_sg_id]

  root_block_device {
    volume_size = 30
    volume_type = "gp3"
  }

  user_data = <<-EOF
              #!/bin/bash
              apt-get update
              apt-get upgrade -y
              hostnamectl set-hostname master-node
              EOF

  tags = {
    Name = "${var.environment}-master-node"
    Role = "Jenkins-Master"
  }
}

# Worker Node (Application)
resource "aws_instance" "worker" {
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = var.worker_instance_type
  key_name               = var.key_pair_name
  subnet_id              = var.public_subnet_id
  vpc_security_group_ids = [var.worker_sg_id]

  root_block_device {
    volume_size = 20
    volume_type = "gp3"
  }

  user_data = <<-EOF
              #!/bin/bash
              apt-get update
              apt-get upgrade -y
              hostnamectl set-hostname worker-node
              EOF

  tags = {
    Name = "${var.environment}-worker-node"
    Role = "Application-Worker"
  }
}

# RabbitMQ Node (Monitoring)
resource "aws_instance" "rabbitmq" {
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = var.rabbitmq_instance_type
  key_name               = var.key_pair_name
  subnet_id              = var.public_subnet_id
  vpc_security_group_ids = [var.rabbitmq_sg_id]

  root_block_device {
    volume_size = 20
    volume_type = "gp3"
  }

  user_data = <<-EOF
              #!/bin/bash
              apt-get update
              apt-get upgrade -y
              hostnamectl set-hostname rabbitmq-node
              EOF

  tags = {
    Name = "${var.environment}-rabbitmq-node"
    Role = "RabbitMQ-Monitoring"
  }
}
