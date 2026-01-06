# Environment Configuration
environment = "production"
aws_region  = "us-east-1"

# EC2 Key Pair - IMPORTANT: Create this key first!
# aws ec2 create-key-pair --key-name campaign-key --region us-east-1 --query 'KeyMaterial' --output text > ~/.ssh/key.pem
key_pair_name = "key"

# SSH Access - For production, restrict this to your IP
# Example: "123.45.67.89/32"
ssh_allowed_cidr = "0.0.0.0/0"

# Instance Types
master_instance_type   = "t3.medium"  # Jenkins needs more resources
worker_instance_type   = "t3.small"   # Application server
rabbitmq_instance_type = "t3.small"   # Monitoring stack

# Network Configuration
vpc_cidr            = "10.0.0.0/16"
availability_zones  = ["us-east-1a", "us-east-1b"]
public_subnet_cidrs = ["10.0.1.0/24", "10.0.2.0/24"]
