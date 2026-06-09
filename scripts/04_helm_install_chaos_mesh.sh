VERSION=2.8.2 && helm install chaos-mesh chaos-mesh/chaos-mesh \
  --version $VERSION \
  --namespace chaos-testing \
  --create-namespace \
  --set chaosDaemon.env.DOCKER_API_VERSION="1.54" \
  --set dashboard.securityMode=false \
  --set dashboard.service.nodePort=31111