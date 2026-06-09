go install go.k6.io/xk6/cmd/xk6@latest

xk6 build v0.52.0 \
  --with github.com/grafana/xk6-kubernetes@latest \
  --with github.com/szkiba/xk6-yaml@latest