import { Kubernetes } from 'k6/x/kubernetes';

const manifest = `
apiVersion: batch/v1
kind: Job
metadata:
  name: busybox
  namespace: default
spec:
  template:
    spec:
      restartPolicy: Never
      containers:
      - name: busybox
        image: busybox
        command: ["sleep", "300"]
`

export default function () {
  const kubernetes = new Kubernetes();

  //kubectl create deployment kubernetes-bootcamp --image=gcr.io/google-samples/kubernetes-bootcamp:v1
//kubectl get deployments

  kubernetes.apply(manifest)

 // const jobs = kubernetes.list("job", "default");

  const pods = kubernetes.list("pod", "default");

  console.log(`${pods.length} pods found:`);
  pods.map(function(pod) {
    console.log(`  ${pod.metadata.name}`)
  });
}