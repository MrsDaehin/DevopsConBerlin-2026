import http from 'k6/http';
import { check, sleep } from 'k6';
import { Kubernetes } from 'k6/x/kubernetes';


import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';

const namespace = __ENV.NAMESPACE || 'default';
const targetUrl = __ENV.TARGET_URL || 'http://localhost:64703/';

const potatoKillYaml = '../experiments/potatokill.yaml';
const experimentManifestRaw = open(potatoKillYaml);

export const options = {
  scenarios: {
    load: {
      executor: 'constant-vus',
      exec: 'load',
      vus: 1,
      duration: '2m',
    },
    disrupt: {
      executor: 'shared-iterations',
      exec: 'disrupt',
      vus: 1,
      iterations: 1,
      startTime: '10s',
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
  console.log('Injecting Chaos Mesh PodChaos kill experiment');

  const kubernetes = new Kubernetes();

  kubernetes.apply(experimentManifestRaw);

  sleep(90);

  console.log('Pod kill experiment finished');
}

export function teardown() {
  console.log('Cleaning Chaos Mesh pod kill experiment');

  const kubernetes = new Kubernetes();

  try {
    kubernetes.delete(
      'PodChaos.chaos-mesh.org',
      'k6-pod-kill',
      namespace
    );
  } catch (e) {
    console.log(`Cleanup skipped or failed: ${e}`);
  }
}

export function handleSummary(data) {
  return {
    'pod-kill-report.html': htmlReport(data),
  };
}