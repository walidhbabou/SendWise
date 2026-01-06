# Ansible Configuration - Campaign Creator Suite

Infrastructure as Code - Configuration automatique des 3 serveurs EC2.

## 📋 Structure

```
ansible/
├── site.yml                    # Playbook principal
├── ansible.cfg                 # Configuration Ansible
├── group_vars/
│   └── all.yml                # Variables globales
├── inventories/
│   └── hosts.ini              # Inventory (généré par Terraform)
└── roles/
    ├── common/                # Rôle commun (Docker, etc.)
    ├── jenkins/               # Configuration Jenkins Master
    ├── worker/                # Configuration Worker Node
    └── rabbitmq/              # Configuration RabbitMQ + Monitoring
```

## 🚀 Utilisation

### Prérequis

1. **Terraform déployé** - Les 3 instances EC2 doivent être créées
2. **Inventory généré** - Terraform génère automatiquement `inventories/hosts.ini`
3. **Ansible installé** sur votre machine locale

### Installation Ansible

```bash
# Sur Ubuntu/WSL
sudo apt update
sudo apt install ansible -y

# Vérifier l'installation
ansible --version
```

### Exécution

```bash
# 1. Aller dans le dossier ansible
cd ansible

# 2. Tester la connectivité
ansible all -i inventories/hosts.ini -m ping

# 3. Lancer la configuration complète
ansible-playbook -i inventories/hosts.ini site.yml

# 4. Configuration verbose (si problème)
ansible-playbook -i inventories/hosts.ini site.yml -vvv
```

### Configuration par rôle

```bash
# Configurer uniquement le Master (Jenkins)
ansible-playbook -i inventories/hosts.ini site.yml --tags master

# Configurer uniquement le Worker
ansible-playbook -i inventories/hosts.ini site.yml --tags worker

# Configurer uniquement RabbitMQ
ansible-playbook -i inventories/hosts.ini site.yml --tags rabbitmq
```

## 🔧 Personnalisation

### Variables globales

Éditez `group_vars/all.yml` :

```yaml
# Docker image de votre application
docker_image: "votre-username/campaign-creator-suite:latest"

# Credentials RabbitMQ
rabbitmq_user: "admin"
rabbitmq_password: "VotreMotDePasse"

# Credentials Grafana
grafana_user: "admin"
grafana_password: "VotreMotDePasse"
```

## 📊 Ce qui est installé

### Sur tous les serveurs (rôle common)
- Docker CE
- Docker Compose
- Outils système (git, vim, htop, etc.)

### Master Node (rôle jenkins)
- Jenkins LTS (port 8080)
- Configuration Docker-in-Docker

### Worker Node (rôle worker)
- Prêt à déployer votre application
- Docker Compose configuré

### RabbitMQ Node (rôle rabbitmq)
- RabbitMQ (ports 5672, 15672)
- Prometheus (port 9090)
- Grafana (port 3001)

## 🔐 Accès aux services

Après l'exécution d'Ansible :

```bash
# Récupérer les IPs depuis Terraform
cd ../terraform
terraform output master_public_ip
terraform output worker_public_ip
terraform output rabbitmq_public_ip
```

Puis accéder :
- **Jenkins**: http://<MASTER_IP>:8080
- **Application**: http://<WORKER_IP>:3000
- **RabbitMQ**: http://<RABBITMQ_IP>:15672
- **Grafana**: http://<RABBITMQ_IP>:3001
- **Prometheus**: http://<RABBITMQ_IP>:9090

## 🔑 Récupérer le mot de passe Jenkins

```bash
ssh -i ~/.ssh/campaign-key.pem ubuntu@<MASTER_IP> \
    'sudo docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword'
```

## 🐛 Dépannage

### Problème de connexion SSH

```bash
# Vérifier les permissions de la clé
chmod 400 ~/.ssh/campaign-key.pem

# Tester la connexion manuelle
ssh -i ~/.ssh/campaign-key.pem ubuntu@<IP>
```

### Ansible ne trouve pas l'inventory

```bash
# Vérifier que Terraform a généré l'inventory
cat inventories/hosts.ini

# Spécifier le chemin absolu
ansible-playbook -i /path/to/inventories/hosts.ini site.yml
```

### Docker ne démarre pas

```bash
# Se connecter au serveur
ssh -i ~/.ssh/campaign-key.pem ubuntu@<IP>

# Vérifier le statut Docker
sudo systemctl status docker

# Redémarrer Docker
sudo systemctl restart docker
```

### Relancer Ansible

```bash
# Forcer la reconfiguration
ansible-playbook -i inventories/hosts.ini site.yml --force
```

## 📝 Notes

- L'inventory est généré automatiquement par Terraform
- Les mots de passe par défaut doivent être changés en production
- Les services démarrent automatiquement au boot
- Les volumes Docker persistent les données

## 🔄 Mise à jour

Pour mettre à jour la configuration :

```bash
# 1. Modifier les fichiers dans ansible/
# 2. Relancer le playbook
ansible-playbook -i inventories/hosts.ini site.yml
```

## 🎯 Prochaines étapes

1. ✅ Configurer Jenkins avec votre pipeline
2. ✅ Déployer votre application sur Worker
3. ✅ Configurer les dashboards Grafana
4. ✅ Mettre en place les alertes RabbitMQ
