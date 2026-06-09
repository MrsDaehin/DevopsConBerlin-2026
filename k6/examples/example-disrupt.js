import http from 'k6/http';
import { check, sleep } from 'k6';
import { Kubernetes } from 'k6/x/kubernetes';

const namespace = __ENV.NAMESPACE || 'default';
const targetUrl = __ENV.TARGET_URL || 'http://demo-app.default.svc.cluster.local';

const kubernetes = new Kubernetes();

export const options = {
  scenarios: {
    load: {
      executor: 'constant-vus',
      exec: 'load',
      vus: 10,
      duration: '5m',
    },
    disrupt: {
      executor: 'shared-iterations',
      exec: 'disrupt',
      vus: 1,
      iterations: 1,
      startTime: '1m',
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.05'],
    http_req_duration: ['p(95)<800'],
  },
};

export function load() {
  const res = http.get(targetUrl);

  check(res, {
    'status is 200': r => r.status === 200,
    'latency < 800ms': r => r.timings.duration < 800,
  });

  sleep(1);
}

export function disrupt() {
  console.log('Injecting Chaos Mesh NetworkChaos experiment');

  const experiment = `
apiVersion: chaos-mesh.org/v1alpha1
kind: NetworkChaos
metadata:
  name: k6-network-delay
  namespace: ${namespace}
spec:
  action: delay
  mode: all
  selector:
    namespaces:
      - ${namespace}
    labelSelectors:
      app: demo-app
  delay:
    latency: "300ms"
    correlation: "100"
    jitter: "50ms"
  duration: "90s"
`;

  kubernetes.apply(experiment);

  sleep(90);

  console.log('Chaos experiment finished');
}

export function teardown() {
  console.log('Cleaning Chaos Mesh experiment');

  try {
    kubernetes.delete(
      'NetworkChaos.chaos-mesh.org',
      'k6-network-delay',
      namespace
    );
  } catch (e) {
    console.log(`Cleanup skipped or failed: ${e}`);
  }
}