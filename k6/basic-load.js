import http from 'k6/http';
import { check, sleep } from 'k6';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';

export const options = {
  vus: 1,
  duration: '30s',
  thresholds: {
    'http_req_duration{name:home}': ['p(95)<500'],
    'http_req_duration{name:productpage}': ['p(95)<700'],
    'http_req_failed': ['rate<0.01'],
  },
};

export default function () {
  const res1 = http.get('http://localhost:9080/', { tags: { name: 'home' } });
  check(res1, {
    'home page status is 200': (r) => r.status === 200,
  });
  sleep(1);

  const res2 = http.get('http://localhost:9080/productpage?u=normal', { tags: { name: 'productpage' } });
  check(res2, {
    'productpage status is 200': (r) => r.status === 200,
  });
  sleep(1);
}

export function handleSummary(data) {
  return {
    'basic-load-report.html': htmlReport(data),
  };
}
