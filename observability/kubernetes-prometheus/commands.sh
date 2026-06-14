##### create namespace

kubectl create namespace monitoring

#### set role for prometheus
kubectl create -f clusterRole.yaml

#### Create a Config Map To Externalize Prometheus Configurations
kubectl create -f config-map.yaml
#### In Prometheus terms, the config for collecting metrics from a collection of endpoints is called a job.

#### create deployment
kubectl create  -f prometheus-deployment.yaml 

kubectl get deployments --namespace=monitoring

#### Connecting To Prometheus Dashboard

kubectl get pods --namespace=monitoring

###### Method 2: Exposing Prometheus as a Service [NodePort & LoadBalancer]

kubectl create -f prometheus-service.yaml --namespace=monitoring


## Port-forward: prefer service; if that fails, forward the first Prometheus pod
# Forward the Prometheus service (preferred)
kubectl port-forward svc/prometheus-service 8080:8080 -n monitoring || \
# Fallback: forward the first pod labeled for Prometheus (prometheus-server)
POD=$(kubectl get pods -n monitoring -l app=prometheus-server -o jsonpath='{.items[0].metadata.name}') && kubectl port-forward pod/"$POD" 8080:9090 -n monitoring



####  create kube state metrics configs

## kube-state-metrics configs live in the sibling folder; apply from here
kubectl apply -f ../kube-state-metrics-configs/

##### now all targets should be up 


#### deploy grafana

## Grafana resources are in the sibling kubernetes-grafana folder
kubectl create -f ../kubernetes-grafana/grafana-datasource-config.yaml
kubectl create -f ../kubernetes-grafana/deployment.yaml
