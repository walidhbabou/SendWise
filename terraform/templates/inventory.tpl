[master]
${master_ip} ansible_user=ubuntu ansible_ssh_private_key_file=~/.ssh/${key_file}.pem

[worker]
${worker_ip} ansible_user=ubuntu ansible_ssh_private_key_file=~/.ssh/${key_file}.pem

[rabbitmq]
${rabbitmq_ip} ansible_user=ubuntu ansible_ssh_private_key_file=~/.ssh/${key_file}.pem

[all:vars]
ansible_python_interpreter=/usr/bin/python3
ansible_ssh_common_args='-o StrictHostKeyChecking=no'
master_private_ip=${master_ip}
worker_private_ip=${worker_ip}
rabbitmq_private_ip=${rabbitmq_ip}
