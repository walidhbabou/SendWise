pipeline {
    agent any
    
    triggers {
        githubPush()
    }
    
    
    environment {
        DOCKER_IMAGE = 'walidhbabou/campaign-creator-suite'
        DOCKER_CREDENTIALS_ID = 'dockerhub-credentials'
        K8S_NAMESPACE = 'campaign-suite'
        K8S_DEPLOYMENT = 'campaign-app'
        MASTER_HOST = '10.0.1.185'
        MASTER_USER = 'ubuntu'
    }
    
    stages {
        stage('Prepare') {
            steps {
                echo '📦 Preparing workspace...'
                echo "Working directory: ${WORKSPACE}"
                sh 'ls -la'
            }
        }
        
        stage('Build Docker Image') {
            steps {
                echo '🐳 Building Docker image...'
                script {
                    sh """
                        docker build -t ${DOCKER_IMAGE}:${BUILD_NUMBER} .
                        docker tag ${DOCKER_IMAGE}:${BUILD_NUMBER} ${DOCKER_IMAGE}:latest
                    """
                }
            }
        }
        
        stage('Push to Docker Hub') {
            steps {
                echo '📤 Pushing to Docker Hub...'
                script {
                    withCredentials([usernamePassword(
                        credentialsId: "${DOCKER_CREDENTIALS_ID}",
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )]) {
                        sh """
                            echo \$DOCKER_PASS | docker login -u \$DOCKER_USER --password-stdin
                            docker push ${DOCKER_IMAGE}:${BUILD_NUMBER}
                            docker push ${DOCKER_IMAGE}:latest
                        """
                    }
                }
            }
        }
        
        stage('Deploy to Kubernetes') {
            steps {
                echo '☸️ Deploying to Kubernetes via SSH...'
                sh """
                    ssh -o StrictHostKeyChecking=no ${MASTER_USER}@${MASTER_HOST} \
                    "kubectl set image deployment/${K8S_DEPLOYMENT} \
                        campaign-app=${DOCKER_IMAGE}:${BUILD_NUMBER} \
                        -n ${K8S_NAMESPACE} && \
                     kubectl rollout status deployment/${K8S_DEPLOYMENT} \
                        -n ${K8S_NAMESPACE} --timeout=5m"
                """
            }
        }
        
        stage('Verify') {
            steps {
                echo '✅ Verifying deployment...'
                sh """
                    ssh -o StrictHostKeyChecking=no ${MASTER_USER}@${MASTER_HOST} \
                    "kubectl get pods -n ${K8S_NAMESPACE} -l app=campaign-app && \
                     kubectl wait --for=condition=ready pod \
                        -l app=campaign-app \
                        -n ${K8S_NAMESPACE} \
                        --timeout=2m"
                """
            }
        }
    }
    
    post {
        success {
            echo '✅ DEPLOYMENT SUCCESSFUL!'
            echo "🌐 Application URL: http://3.230.118.158:30080"
            echo "📦 Docker Image: ${DOCKER_IMAGE}:${BUILD_NUMBER}"
        }
        failure {
            echo '❌ DEPLOYMENT FAILED!'
            sh """
                ssh -o StrictHostKeyChecking=no ${MASTER_USER}@${MASTER_HOST} \
                "kubectl get pods -n ${K8S_NAMESPACE} || true"
            """
        }
        always {
            echo '🧹 Cleaning up...'
            sh 'docker system prune -f || true'
        }
    }
}
