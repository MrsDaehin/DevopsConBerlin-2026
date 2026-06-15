import { Kubernetes } from 'k6/x/kubernetes';
import { sleep } from 'k6';


const cadvisorNamespaceYaml = '../../kubernetes-sample-apps/cadvisor/00-cadvisor-namespace.yaml';
const cadvisorNamespaceManifestRaw = open(cadvisorNamespaceYaml);

const cadvisorServiceAccountYaml = '../../kubernetes-sample-apps/cadvisor/01-cadvisor-serviceaccount.yaml';
const cadvisorServiceAccountManifestRaw = open(cadvisorServiceAccountYaml);

const cadvisorDaemonSetYaml = '../../kubernetes-sample-apps/cadvisor/02-cadvisor-daemonset.yaml';
const cadvisorDaemonSetManifestRaw = open(cadvisorDaemonSetYaml);


const cadvisorServiceYaml = __ENV.CHAOS_MANIFEST || '../../kubernetes-sample-apps/cadvisor/03-cadvisor-service.yaml';
const cadvisorServiceManifestRaw = open(cadvisorServiceYaml);


export default function () {
    const kubernetes = new Kubernetes();

    console.log(`Applying cadvisor manifest from ${cadvisorServiceYaml}`);
    
    kubernetes.apply(cadvisorNamespaceManifestRaw);
    kubernetes.apply(cadvisorServiceAccountManifestRaw);
    kubernetes.apply(cadvisorDaemonSetManifestRaw);
    kubernetes.apply(cadvisorServiceManifestRaw);

    console.log('cadvisor.yaml applied successfully.');

    sleep(10); 
}


export function teardown () {

    const kubernetes = new Kubernetes();
    
    console.log('Cleaning up cadvisor resources...');
    
    // delete resources explicitly using kind/name
    try {
        kubernetes.delete('service', 'cadvisor', 'cadvisor');
    } catch (e) {}
    try {
        kubernetes.delete('daemonset', 'cadvisor', 'cadvisor');
    } catch (e) {}
    try {
        kubernetes.delete('serviceaccount', 'cadvisor', 'cadvisor');
    } catch (e) {}
    // finally delete the namespace
    try {
        kubernetes.delete('namespace', 'cadvisor');
    } catch (e) { console.log(`Namespace cleanup skipped: ${e}`); }
}
