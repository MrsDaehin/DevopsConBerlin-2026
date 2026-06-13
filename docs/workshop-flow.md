## Module 1: Streamlined Load Injection with Grafana k6
We kick off the workshop by establishing a reliable performance baseline using **k6**. This segment focuses on driving synthetic traffic without overcomplicating the scripting layer.

* **Core Concepts:** Introduction to Virtual Users (VUs), duration loops, and custom metric thresholds.
* **Practical Execution:** Writing a straightforward JavaScript scenario to fire continuous HTTP/gRPC requests directly at the exposed `ProductPage` frontend application service.
* **Success Criteria:** Collecting pristine, uncorrupted baseline measurements (such as response time latencies and standard HTTP success/error rates) while the application is under zero structural stress.

---

## Module 2: Intentional Fault Injection via Chaos Mesh
Once our baseline traffic is active, we introduce **Chaos Mesh** to orchestrate real-time, cloud-native disruptions across our 3-node Minikube cluster.

We will systematically evaluate and apply three distinct failure models:
1. **Network Delay (`NetworkChaos`):** Simulating target latency spikes and packet transport bottlenecks to stress-test service timeouts.
2. **Pod Failure (`PodChaos`):** Setting specific application pods (like `Reviews` or `Details`) to an unavailable state to check service dependencies.
3. **Pod Kill (`PodChaos`):** Abruptly terminating application instances to force the Kubernetes scheduler into action and evaluate container recovery speeds.

---

## Module 3: Unifying Tests & Experiments via `xk6-kubernetes`
Running performance scripts and applying raw YAML manifests manually creates disjointed workflows. In this module, we combine both components into a single automated engine.

* **The Power of `xk6`:** Learn how the custom Go binary compilation ecosystem allows extensions to be baked right into the core k6 runner.
* **The `xk6-kubernetes` Extension:** We will script direct interaction with the Kubernetes API inside the k6 execution runtime.
* **Unified Lifecycle:** Crafting a singular script that spins up load loops and programmatically triggers or cleans up Chaos Mesh Custom Resources (CRDs) automatically based on the phase of the load test.

---

## Module 4: The Chaos Disrupt Test Case & Behavioral Expectations
We conclude the workshop by executing our unified script and parsing the results to understand what happened under the hood.

### What the Test Looks Like
The live validation routine will progress through an intentional timeline:
* **00:00 - 01:00:** Plain steady-state traffic to warm up the target services.
* **01:00 - 02:30:** Automated injection of a severe network delay or a service-layer pod kill.
* **02:30 - 04:00:** Chaos cessation, checking how quickly the environment returns to normal.

### Real-time Expectations
Participants will learn to analyze the live output vectors to spot specific resilience signals:
* **The Blast Radius:** Expect a sharp, visible spike in HTTP error percentages or processing timeouts the exact second a pod is terminated or delayed.
* **Cascading Failures:** We will verify whether the `ProductPage` gateway isolates the failing backend components cleanly or falls over entirely.
* **Self-Healing Verification:** We expect to observe the 3-node cluster auto-heal (e.g., spinning up fresh pod replacements) and watch k6 metrics return gracefully to the baseline curve without manual developer intervention.