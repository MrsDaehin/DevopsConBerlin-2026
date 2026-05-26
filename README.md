# DevopsConBerlin-2026


Because we will want to be able to easily examine resource utilization in the course of this article, we are also going to install Google’s cadvisor to provide some simple resource monitoring, utilizing this Kubernetes YAML8 manifest, which will create the cadvisor Namespace, ServiceAccount, and DaemonSet. We can achieve this by copying the manifest below into a file called cadvisor.yaml and then running kubectl apply -f ./cadvisor.yaml.

https://github.com/google/cadvisor

You can verify that the cadvisor DaemonSet is in a good state by running kubectl get daemonset -n cadvisor, and ensuring that there is one pod per worker, which is both READY and AVAILABLE. Once everything is running, you can access the cadvisor dashboard on one of the nodes by opening up a new terminal and running:

$ kubectl port-forward -n cadvisor pods/$(kubectl get pods -o jsonpath="{.items[0].metadata.name}" -n cadvisor) 8080

Forwarding from 127.0.0.1:8080 -> 8080
Forwarding from [::1]:8080 -> 8080

Then, open up a web browser and point it to http://127.0.0.1:8080/containers/.

Chaos Mesh has three primary concepts that form the core of the tool and its capabilities. These include:

Experiments (local UI) - which are used to define the parameters of a single chaos test that the user wants to run. This will include the type of chaos to inject into the system and specifically how that chaos will be shaped and what it will target.
Workflows (local UI) - this allows you to define a complex series of tests that should run in an environment to more closely simulate complex real-world outages.
Schedules (local UI) - expands upon Experiments by making them run on a defined schedule.

https://superorbital.io/blog/chaos-mesh/