import { Kubernetes } from 'k6/x/kubernetes';


const cadvisorNamespaceYaml = '../../app/cadvisor/00-cadvisor-namespace.yaml';
const cadvisorNamespaceManifestRaw = open(cadvisorNamespaceYaml);

const cadvisorServiceAccountYaml = '../../app/cadvisor/01-cadvisor-serviceaccount.yaml';
const cadvisorServiceAccountManifestRaw = open(cadvisorServiceAccountYaml);

const cadvisorDaemonSetYaml = '../../app/cadvisor/02-cadvisor-daemonset.yaml';
const cadvisorDaemonSetManifestRaw = open(cadvisorDaemonSetYaml);


const cadvisorServiceYaml = __ENV.CHAOS_MANIFEST || '../../app/cadvisor/03-cadvisor-service.yaml';
const cadvisorServiceManifestRaw = open(cadvisorServiceYaml);


export default function () {
    const kubernetes = new Kubernetes();

    console.log(`Applying cadvisor manifest from ${cadvisorServiceYaml}`);
    
    
    // Pass raw YAML string to kubernetes.apply() to handle multi-document files
    kubernetes.apply(cadvisorNamespaceManifestRaw);
    kubernetes.apply(cadvisorServiceAccountManifestRaw);
    kubernetes.apply(cadvisorDaemonSetManifestRaw);
    kubernetes.apply(cadvisorServiceManifestRaw);

    console.log('cadvisor.yaml applied successfully.');
}


export function teardown () {

    const kubernetes = new Kubernetes();
    
    console.log('Cleaning up cadvisor resources...');
    
    kubernetes.delete(cadvisorNamespaceManifestRaw);
    kubernetes.delete(cadvisorServiceAccountManifestRaw);
    kubernetes.delete(cadvisorDaemonSetManifestRaw);
    kubernetes.delete(cadvisorServiceManifestRaw);
}
