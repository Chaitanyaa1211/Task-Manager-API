pipeline {
    agent any
    environment {
            APP_DIR     = "app"
            IMAGE_NAME  = "chaitanyaaaa/task-manager" 
            TAG         = "1.${BUILD_NUMBER}"
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
			sh '''
			    helm upgrade --install task-manager ./helm/task-manager-api/ \
			    --set image.tag=${TAG} \
			    --set replicaSet=2
			   '''   
                }
            }
        }
    }
}

