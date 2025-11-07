pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/Nithya25-07/bookstore-frontend.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }

        stage('Build') {
            steps {
                bat 'npm run build'
            }
        }

        stage('Test') {
            steps {
                // Allow pipeline to continue even if there are no tests
                bat 'npm test --passWithNoTests'
            }
        }

        stage('Deploy') {
            steps {
                echo ' Frontend build successful. Ready for deployment!'
            }
        }
    }
}
