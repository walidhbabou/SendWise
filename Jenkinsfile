pipeline {
    agent any
    
    environment {
        // Docker Configuration
        DOCKER_REGISTRY = 'docker.io'
        DOCKER_IMAGE = 'walidhhabou/campaign-creator-suite'
        DOCKER_CREDENTIALS_ID = 'dockerhub-credentials'
        
        // Kubernetes Configuration
        K8S_NAMESPACE = 'campaign-suite'
        K8S_DEPLOYMENT = 'campaign-app'
        
        // Build Information
        BUILD_TAG = "${BUILD_NUMBER}"
        GIT_COMMIT_SHORT = sh(script: "git rev-parse --short HEAD || echo 'unknown'", returnStdout: true).trim()
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo '📦 Checking out source code...'
                checkout scm
                script {
                    env.GIT_COMMIT_MSG = sh(script: "git log -1 --pretty=%B || echo 'No commit message'", returnStdout: true).trim()
                }
            }
        }
        
        stage('Build Info') {
            steps {
                echo "🏗️  Build Information:"
                echo "   - Build Number: ${BUILD_NUMBER}"
                echo "   - Git Commit: ${GIT_COMMIT_SHORT}"
                echo "   - Commit Message: ${env.GIT_COMMIT_MSG}"
                echo "   - Docker Image: ${DOCKER_IMAGE}:${BUILD_TAG}"
            }
        }
        
        stage('Build Docker Image') {
            steps {
                echo '🐳 Building Docker image...'
                script {
                    dockerImage = docker.build("${DOCKER_IMAGE}:${BUILD_TAG}", ".")
                    docker.build("${DOCKER_IMAGE}:latest", ".")
                }
            }
        }
        
        stage('Test Docker Image') {
            steps {
                echo '🧪 Testing Docker image...'
                script {
                    sh """
                        docker run --rm ${DOCKER_IMAGE}:${BUILD_TAG} nginx -t
                        echo "✅ Docker image test passed"
                    """
                }
            }
        }
        
        stage('Push to Docker Hub') {
            steps {
                echo '📤 Pushing images to Docker Hub...'
                script {
                    docker.withRegistry('https://registry.hub.docker.com', env.DOCKER_CREDENTIALS_ID) {
                        dockerImage.push("${BUILD_TAG}")
                        dockerImage.push("latest")
                        echo "✅ Images pushed successfully"
                    }
                }
            }
        }
        
        stage('Update Kubernetes Deployment') {
            steps {
                echo '☸️  Updating Kubernetes deployment...'
                script {
                    sh """
                        # Update the deployment with new image
                        kubectl set image deployment/${K8S_DEPLOYMENT} \
                            campaign-app=${DOCKER_IMAGE}:${BUILD_TAG} \
                            -n ${K8S_NAMESPACE}
                        
                        # Annotate deployment with build info
                        kubectl annotate deployment/${K8S_DEPLOYMENT} \
                            kubernetes.io/change-cause="Build ${BUILD_NUMBER} - ${GIT_COMMIT_SHORT}" \
                            -n ${K8S_NAMESPACE} --overwrite
                    """
                }
            }
        }
        
        stage('Wait for Rollout') {
            steps {
                echo '⏳ Waiting for rollout to complete...'
                script {
                    sh """
                        kubectl rollout status deployment/${K8S_DEPLOYMENT} \
                            -n ${K8S_NAMESPACE} \
                            --timeout=5m
                    """
                }
            }
        }
        
        stage('Verify Deployment') {
            steps {
                echo '✅ Verifying deployment...'
                script {
                    sh """
                        echo "=== Pods Status ==="
                        kubectl get pods -n ${K8S_NAMESPACE} -l app=campaign-app
                        
                        echo ""
                        echo "=== Service Status ==="
                        kubectl get svc -n ${K8S_NAMESPACE} ${K8S_DEPLOYMENT}-service
                        
                        echo ""
                        echo "=== Deployment Details ==="
                        kubectl describe deployment ${K8S_DEPLOYMENT} -n ${K8S_NAMESPACE} | grep -A 5 "Replicas:"
                        
                        echo ""
                        echo "=== Recent Events ==="
                        kubectl get events -n ${K8S_NAMESPACE} --sort-by='.lastTimestamp' | tail -10
                    """
                }
            }
        }
        
        stage('Health Check') {
            steps {
                echo '🏥 Running health checks...'
                script {
                    sh """
                        # Wait for pods to be ready
                        kubectl wait --for=condition=ready pod \
                            -l app=campaign-app \
                            -n ${K8S_NAMESPACE} \
                            --timeout=2m
                        
                        # Get pod name
                        POD_NAME=\$(kubectl get pod -n ${K8S_NAMESPACE} -l app=campaign-app -o jsonpath='{.items[0].metadata.name}')
                        
                        # Check if nginx is responding
                        kubectl exec -n ${K8S_NAMESPACE} \$POD_NAME -- curl -f http://localhost/ > /dev/null
                        
                        echo "✅ Health check passed"
                    """
                }
            }
        }
        
        stage('Send Notification') {
            steps {
                echo '📢 Sending deployment notification to RabbitMQ...'
                script {
                    sh """
                        # Send notification to RabbitMQ
                        RABBITMQ_POD=\$(kubectl get pod -n ${K8S_NAMESPACE} -l app=rabbitmq -o jsonpath='{.items[0].metadata.name}')
                        
                        kubectl exec -n ${K8S_NAMESPACE} \$RABBITMQ_POD -- \
                            curl -u admin:admin123 \
                            -H "content-type:application/json" \
                            -X POST http://localhost:15672/api/exchanges/%2F/amq.default/publish \
                            -d '{
                                "properties": {},
                                "routing_key": "deployments",
                                "payload": "Build ${BUILD_NUMBER} deployed successfully - ${GIT_COMMIT_SHORT}",
                                "payload_encoding": "string"
                            }' || echo "Warning: Could not send RabbitMQ notification"
                    """
                }
            }
        }
    }
    
    post {
        success {
            echo """
            ✅ ========================================
            ✅ DEPLOYMENT SUCCESSFUL!
            ✅ ========================================
            📦 Build: #${BUILD_NUMBER}
            🐳 Image: ${DOCKER_IMAGE}:${BUILD_TAG}
            🔗 Commit: ${GIT_COMMIT_SHORT}
            📝 Message: ${env.GIT_COMMIT_MSG}
            🌐 Access: http://3.230.118.158:30080
            ✅ ========================================
            """
        }
        
        failure {
            echo """
            ❌ ========================================
            ❌ DEPLOYMENT FAILED!
            ❌ ========================================
            📦 Build: #${BUILD_NUMBER}
            🔗 Commit: ${GIT_COMMIT_SHORT}
            📝 Message: ${env.GIT_COMMIT_MSG}
            ❌ ========================================
            """
        }
        
        always {
            echo '🧹 Cleaning up...'
            sh """
                # Clean up local Docker images to save space
                docker rmi ${DOCKER_IMAGE}:${BUILD_TAG} || true
                docker system prune -f || true
            """
        }
    }
}
