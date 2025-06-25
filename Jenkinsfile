pipeline {
    agent any

    tools {
        git 'Default'
        nodejs 'JenkinsNodeJS'
    }

    stages {
        stage('Checkout Frontend Code') {
            steps {
                echo 'Pulling the latest frontend code.'
                checkout scm
            }
        }

        stage('Install Frontend Dependencies') {
            steps {
                echo 'Installing frontend dependencies.'
                sh 'npm install'
            }
        }

        stage('Build Frontend Application') {
            steps {
                echo 'Building frontend application.'
                sh 'npx next build'
            }
        }

        stage('Test Frontend Application') {
            steps {
                withCredentials([
                    // Placeholder for frontend Appwrite or other test secrets
                    // string(credentialsId: 'FRONTEND_APPWRITE_ENDPOINT_CREDENTIAL', variable: 'APPWRITE_ENDPOINT_FRONTEND_TEST'),
                    // string(credentialsId: 'FRONTEND_APPWRITE_PROJECT_ID_CREDENTIAL', variable: 'APPWRITE_PROJECT_ID_FRONTEND_TEST'),
                ]) {
                    echo 'Running tests for Frontend Application.'
                    sh 'npm run test'
                }
            }
        }

        stage('Containerize Frontend') {
            steps {
                script {
                    echo 'Creating Docker image for Frontend.'
                    def frontendImage = docker.build("gworld1/cultural-touristic-web-app:${env.BUILD_NUMBER}", ".")
                    echo "Frontend Docker image built: ${frontendImage.id}"
                }
            }
        }

        stage('Push Frontend Image') {
            steps {
                script {
                    echo 'Pushing Frontend Docker image to Docker Hub.'
                    docker.withRegistry('https://registry.hub.docker.com', 'docker-hub-credentials') {
                        docker.image("gworld1/cultural-touristic-web-app:${env.BUILD_NUMBER}").push()
                    }
                    echo "Frontend Docker image pushed."
                }
            }
        }

        stage('Deploy Frontend') {
            steps {
                script {
                    echo 'Deploying Frontend Application to Kubernetes.'

                    def serviceImage = "gworld1/cultural-touristic-web-app:${env.BUILD_NUMBER}"
                    def manifestPath = "k8s-manifests/frontend-deployment.yaml"

                    withCredentials([
                        file(credentialsId: 'k3s-kubeconfig', variable: 'KUBECONFIG_FILE_PATH'),
                        // Placeholder for frontend Appwrite or other runtime secrets
                        string(credentialsId: 'FRONTEND_APPWRITE_ENDPOINT_CREDENTIAL', variable: 'APPWRITE_ENDPOINT_VAL_FRONTEND'),
                        string(credentialsId: 'FRONTEND_APPWRITE_PROJECT_ID_CREDENTIAL', variable: 'APPWRITE_PROJECT_ID_VAL_FRONTEND'),
                        string(credentialsId: 'FRONTEND_API_KEY_CREDENTIAL', variable: 'APPWRITE_API_KEY_VAL_FRONTEND'),
                        string(credentialsId: 'FRONTEND_DATABASE_ID_CREDENTIAL', variable: 'APPWRITE_DATABASE_ID_VAL_FRONTEND')
                    ]) {
                        withEnv(["KUBECONFIG=${KUBECONFIG_FILE_PATH}"]) {
                            echo "Kubectl is configured."

                            echo "Creating or updating 'frontend-secrets' in Kubernetes."
                            sh """
                                kubectl create secret generic frontend-secrets \\
                                --from-literal=APPWRITE_ENDPOINT=${APPWRITE_ENDPOINT_VAL_FRONTEND} \\
                                --from-literal=APPWRITE_PROJECT_ID=${APPWRITE_PROJECT_ID_VAL_FRONTEND} \\
                                --from-literal=APPWRITE_API_KEY=${APPWRITE_API_KEY_VAL_FRONTEND} \\
                                --from-literal=APPWRITE_DATABASE_ID=${APPWRITE_DATABASE_ID_VAL_FRONTEND} \\
                                --dry-run=client -o yaml | kubectl apply -f -
                            """
                            echo "Kubernetes secret for Frontend handled."

                            echo "Updating image in ${manifestPath} to ${serviceImage}."
                            sh """
                                yq e '.spec.template.spec.containers[] | select(.name == "frontend-app").image = "${serviceImage}"' -i "${manifestPath}"
                            """
                            echo "Image update attempted via yq."

                            echo "Applying Frontend Kubernetes manifests from ${manifestPath}."
                            sh "kubectl apply -f ${manifestPath}"
                            echo "Frontend Kubernetes manifests applied."

                            echo "Waiting for Frontend deployment to roll out."
                            sh "kubectl rollout status deployment/frontend-service"
                            echo "Frontend deployment updated successfully."
                        }
                    }
                    echo 'Frontend deployment pipeline finished.'
                }
            }
        }
    }

    post {
        always {
            echo 'Frontend Pipeline run complete.'
        }
        failure {
            echo 'Frontend Pipeline failed.'
        }
        success {
            echo 'Frontend Pipeline succeeded!'
        }
    }
}
