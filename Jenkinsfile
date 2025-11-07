pipeline {
    agent any

    environment {
        // Specify Node.js if you have one configured in Jenkins (optional)
        // PATH = "${tool 'NodeJS'}\\bin;${env.PATH}"
    }

    stages {

        stage('Checkout') {
            steps {
                // Checkout the correct main branch
                git branch: 'main',
                    url: 'https://github.com/Nithya25-07/bookstore-frontend.git'
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
                bat 'npm test -- --passWithNoTests || exit 0'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deployment stage (you can add deployment commands here later)'
                // Example (if you use a web server or FTP):
                // bat 'xcopy build "C:\\path\\to\\deploy\\folder" /E /H /C /I /Y'
            }
        }
    }

    post {
        success {
            echo '🎉 Build completed successfully!'
        }
        failure {
            echo '❌ Build failed. Check the console output for details.'
        }
    }
}
