pipeline {
    agent any
    environment {
            APP_DIR     = "app"
            IMAGE_NAME  = "chaitanyaaaa/task-manager" 
            TAG         = "${BUILD_NUMBER}"
    }
    stages {
        stage ("install") {
            steps {
                dir ("${APP_DIR}") {
                    sh 'npm install'
                }
            }
        }
        stage ("test") {
            steps {
                dir ("${APP_DIR}") {
                    sh 'npm test'
                }
            }
        }
        stage ('Built') {
            steps {
                sh "docker build -t ${IMAGE_NAME}:${TAG} ."
                }
        }
        stage ('Push') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'DockerHub-Creds', usernameVariable: 'USER', passwordVariable: 'PASS' )]) {
                    sh 'echo $PASS | docker login -u $USER --password-stdin'
                    sh "docker push ${IMAGE_NAME}:${TAG}"
                }
            }
        }
        stage ("Deploy") {
            steps {
                withCredentials([file(credentialsId: 'kubeconfig', variable: 'KUBECONFIG')]) {
                    	sh " sed -i 's|${IMAGE_NAME}:latest|${IMAGE_NAME}:${TAG}|g' k8s/deployment.yml"
			sh ' kubectl apply -f k8s/ '
                }
            }
        }
    }
}

