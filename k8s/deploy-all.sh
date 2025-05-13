#!/bin/bash

# Set your Docker Hub username
DOCKER_USERNAME="syedmuneebkazmi"

# Create a temporary file with the Docker username replaced
sed "s/\${DOCKER_USERNAME}/$DOCKER_USERNAME/g" all-in-one-deployment.yaml > temp-deployment.yaml

# Apply the Kubernetes manifests
kubectl apply -f temp-deployment.yaml

# Remove the temporary file
rm temp-deployment.yaml

# Wait for deployments to be ready
echo "Waiting for deployments to be ready..."
kubectl rollout status deployment/mongo
kubectl rollout status deployment/backend
kubectl rollout status deployment/frontend

# Get the URL for the frontend service
minikube service frontend --url