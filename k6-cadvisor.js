import { Kubernetes } from 'k6/x/kubernetes';


const cadvisorNamespaceYaml = './manifests/00-cadvisor-namespace.yaml';
const cadvisorNamespaceManifestRaw = open(cadvisorNamespaceYaml);

const cadvisorServiceAccountYaml = './manifests/01-cadvisor-serviceaccount.yaml';
const cadvisorServiceAccountManifestRaw = open(cadvisorServiceAccountYaml);

const cadvisorDaemonSetYaml = './manifests/02-cadvisor-daemonset.yaml';
const cadvisorDaemonSetManifestRaw = open(cadvisorDaemonSetYaml);


const cadvisorServiceYaml = __ENV.CHAOS_MANIFEST || './manifests/03-cadvisor-service.yaml';
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
