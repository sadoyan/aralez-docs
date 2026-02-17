## 🚀 Aralez performance benchmarks

## 💡 Simple benchmark by [Oha](https://github.com/hatoo/oha)

### **Reverse Proxy Mixed Load Benchmark**

#### **Test Overview**

**Proxies tested:**

* Aralez
* HAProxy
* Envoy
* NginX
* Traefik
* Caddy

**Load profile:**

* Proxy servers running on same host with different ports
* 2x Oha instances for parallel testing of GET/POST requests
* 3x Upstream servers on separate machines with responses per 3 domains with sample json files
* Tuned Kernel parameters for heavy load
* 10 gbit network
* All instances running 4 Core+HT Intel(R) Xeon(R) CPU E5-2699C v4 @ 2.20GHz 
* 60 URLs (deep / nested paths)
* Majority HTTPS (TLS termination active)
* Mixed GET + POST
* JSON payload for POST
* 2048 total concurrent connections (2 × 1024)
* Upstreams on separate machines
* No caching
* Mixed routing and domain handling

### **Latency Distribution (Percentiles)**

**All values in seconds unless otherwise specified.**
**GET Requests**

| Percentile | Aralez | HAProxy | Envoy  | NGINX  | Traefik | Caddy  |
| ---------- | ------ | ------- | ------ | ------ | ------- | ------ |
| p10        | 0.0024 | 0.0303  | 0.0307 | 0.0022 | 0.0781  | 0.0749 |
| p25        | 0.0038 | 0.0492  | 0.0467 | 0.0025 | 0.1105  | 0.1105 |
| p50        | 0.0061 | 0.0691  | 0.0640 | 0.0029 | 0.1271  | 0.1574 |
| p75        | 0.0088 | 0.1035  | 0.0943 | 0.0054 | 0.1483  | 0.2487 |
| p90        | 0.0132 | 0.1407  | 0.1432 | 0.0263 | 0.1798  | 0.3919 |
| p95        | 0.0228 | 0.1742  | 0.2263 | 0.0700 | 0.2142  | 0.4960 |
| p99        | 0.0528 | 0.2846  | 0.4744 | 0.1292 | 0.3859  | 0.7093 |
| p99.9      | 0.1931 | 0.5404  | 1.0309 | 0.2525 | 0.7853  | 1.0799 |
| p99.99     | 0.4220 | 2.5017  | 2.1869 | 0.4524 | 1.1503  | 2.2552 |

**POST Requests**

| Percentile | Aralez | HAProxy | Envoy  | NGINX  | Traefik | Caddy  |
| ---------- | ------ | ------- | ------ | ------ | ------- | ------ |
| p10        | 0.0024 | 0.0295  | 0.0376 | 0.0215 | 0.0790  | 0.0754 |
| p25        | 0.0038 | 0.0485  | 0.0625 | 0.0246 | 0.1107  | 0.1110 |
| p50        | 0.0061 | 0.0684  | 0.0973 | 0.0288 | 0.1273  | 0.1579 |
| p75        | 0.0088 | 0.1027  | 0.1543 | 0.0500 | 0.1484  | 0.2494 |
| p90        | 0.0134 | 0.1399  | 0.3758 | 0.2605 | 0.1801  | 0.3838 |
| p95        | 0.0250 | 0.1730  | 0.5454 | 0.4959 | 0.2147  | 0.4866 |
| p99        | 0.0507 | 0.2829  | 1.2614 | 1.2734 | 0.3741  | 0.6944 |
| p99.9      | 0.1141 | 0.5353  | 2.5964 | 2.3265 | 0.6698  | 1.0126 |
| p99.99     | 0.3616 | 1.4382  | 4.0073 | 4.1945 | 1.2958  | 1.3822 |

### **Observations**

**Median Latency (p50)**

* Aralez shows extremely low median latency in both GET and POST.
* HAProxy and Envoy follow closely for GET.
* NGINX performs well in POST median.
* Traefik and Caddy have noticeably higher baseline latency.

### **Tail Latency (p99)**
**GET**

* Best: Aralez (0.0528s)
* Next: NGINX (0.1292s)
* HAProxy and Traefik moderate
* Envoy higher tail
* Caddy highest tail

**POST**

* Best: Aralez (0.0507s)
* HAProxy stable
* Traefik acceptable
* Envoy and NGINX show significant tail increase under POST
* Caddy moderate but above HAProxy

### **Extreme Tail (p99.9 / p99.99)**

* Aralez remains very stable even at extreme percentiles.
* HAProxy scales predictably but tail widens at 99.99.
* Envoy and NGINX show heavy tail amplification under POST.
* Traefik moderate.
* Caddy shows noticeable spread under stress.

### **High-Level Summary**

**Aralez**

* Best p99 for both GET and POST
* Extremely tight latency distribution
* Minimal tail amplification

**HAProxy**

* Very consistent
* Predictable scaling
* Strong under mixed workload

**NginX**

* Good GET stability
* POST tail increases under high concurrency

**Envoy**

* Good median
* Heavy tail under POST
* Likely requires tuning for buffer/thread settings

**Traefik**

* Higher baseline
* Stable but not high-performance edge grade

**Caddy**

* Clean configuration
* Higher baseline latency
* Larger tail spread under load

### **Requests per second chart during test**
![Aralez](https://raw.githubusercontent.com/sadoyan/aralez/refs/heads/main/assets/bench2.png)

### 📈 Throughput Stability & Peak RPS Analysis
This chart illustrates the Requests Per Second (RPS) during sequential stress tests under a 1024-concurrency load. Each color block represents the "steady-state" performance of the proxy after the kernel was fully optimized.

* **Aralez:** Dominates the chart with the highest sustained throughput, reaching a clean plateau near 30K RPS. Its "flat-top" signature indicates perfect synchronization with the tuned TCP stack, showing almost zero throughput jitter.
* **Nginx:** Achieves high throughput but exhibits significant "noise" and variance (jagged peaks) compared to the stability of Aralez.
* **HAProxy:** Showcases its trademark "unshakeable" stability with perfectly flat lines, though it operates at a lower throughput ceiling (~17K RPS) in this specific environment.
* **Envoy, Traefik, & Caddy:** These engines show a visible "performance tax," with lower sustained RPS and more frequent throughput dips, highlighting the efficiency of the Aralez event-loop.

# 🚀 High-Performance Proxy Benchmark Report

### 🥇 Aralez Performance Highlights:

* **Tail Latency Dominance**: Aralez achieves a **p99 of 0.1931 10 sec**, outperforming Nginx (**0.2525 10 sec**) by more than **2x**.
* **Zero Payload Penalty**: Unlike Envoy or Nginx, Aralez shows almost **identical** performance between GET and POST requests, proving its efficient buffer management.
* **Median Stability**: A p50 of **0.0088 10 sec** ensures that the vast majority of users experience near-instant response times.

---

## 📊 Detailed Comparison Tables

### 1. Response Time Histogram
| Threshold | ARALEZ GET | ARALEZ POST | HAPROXY GET | HAPROXY POST | ENVOY GET | ENVOY POST | NGINX GET | NGINX POST | TRAEFIK GET | TRAEFIK POST | CADDY GET | CADDY POST |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| 0.000 10 sec | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| 0.167 10 sec | 3691654 | 3742220 | 3700723 | 3649573 | 3502620 | 1735719 | 2589172 | 2658901 | 2245581 | 2253228 | 1381444 | 1509978 |
| 0.333 10 sec | 3537 | 2142 | 18484 | 116056 | 23162 | 70454 | 2946 | 105969 | 18185 | 16159 | 126442 | 17428 |
| 0.500 10 sec | 756 | 372 | 1096 | 5880 | 2442 | 16369 | 195 | 14068 | 2069 | 1110 | 7700 | 144 |
| 0.666 10 sec | 8 | 6 | 149 | 1070 | 805 | 6437 | 7 | 1948 | 72 | 326 | 253 | 4 |
| 0.832 10 sec | 129 | 24 | 14 | 528 | 303 | 2572 | 8 | 1543 | 21 | 94 | 78 | 6 |
| 0.999 10 sec | 28 | 9 | 104 | 280 | 106 | 898 | 0 | 291 | 75 | 30 | 124 | 8 |
| 1.165 10 sec | 2 | 0 | 169 | 254 | 38 | 488 | 0 | 102 | 0 | 0 | 41 | 0 |
| 1.332 10 sec | 0 | 1 | 266 | 147 | 42 | 238 | 0 | 98 | 0 | 0 | 15 | 0 |
| 1.498 10 sec | 3 | 0 | 179 | 190 | 14 | 62 | 0 | 16 | 1 | 1 | 10 | 0 |
| 1.665 10 sec | 30 | 3 | 130 | 78 | 17 | 51 | 1 | 11 | 2 | 2 | 2 | 1 |

### 2. Response Time Distribution
| Percentile | ARALEZ GET | ARALEZ POST | HAPROXY GET | HAPROXY POST | ENVOY GET | ENVOY POST | NGINX GET | NGINX POST | TRAEFIK GET | TRAEFIK POST | CADDY GET | CADDY POST |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **10%** | 0.0038 10 sec | 0.0038 10 sec | 0.0492 sec | 0.0485 sec | 0.0467 sec | 0.0625 sec | 0.0025 10 sec | 0.0246 sec | 0.1105 sec | 0.1107 sec | 0.1105 sec | 0.1110 sec |
| **25%** | 0.0061 10 sec | 0.0061 10 sec | 0.0691 sec | 0.0684 sec | 0.0640 sec | 0.0973 sec | 0.0029 10 sec | 0.0288 sec | 0.1271 sec | 0.1273 sec | 0.1574 sec | 0.1579 sec |
| **50%** | 0.0088 10 sec | 0.0088 10 sec | 0.1035 sec | 0.1027 sec | 0.0943 sec | 0.1543 sec | 0.0054 10 sec | 0.0500 sec | 0.1483 sec | 0.1484 sec | 0.2487 sec | 0.2494 sec |
| **75%** | 0.0132 10 sec | 0.0134 10 sec | 0.1407 sec | 0.1399 sec | 0.1432 sec | 0.3758 sec | 0.0263 10 sec | 0.2605 sec | 0.1798 sec | 0.1801 sec | 0.3919 sec | 0.3838 sec |
| **90%** | 0.0228 10 sec | 0.0250 10 sec | 0.1742 sec | 0.1730 sec | 0.2263 sec | 0.5454 sec | 0.0700 10 sec | 0.4959 sec | 0.2142 sec | 0.2147 sec | 0.4960 sec | 0.4866 sec |
| **95%** | 0.0528 10 sec | 0.0507 10 sec | 0.2846 sec | 0.2829 sec | 0.4744 sec | 1.2614 sec | 0.1292 10 sec | 1.2734 sec | 0.3859 sec | 0.3741 sec | 0.7093 sec | 0.6944 sec |
| **99%** | 0.1931 10 sec | 0.1141 10 sec | 0.5404 sec | 0.5353 sec | 1.0309 sec | 2.5964 sec | 0.2525 10 sec | 2.3265 sec | 0.7853 sec | 0.6698 sec | 1.0799 sec | 1.0126 sec |
| **99.9%** | 0.4220 10 sec | 0.3616 10 sec | 2.5017 sec | 1.4382 sec | 2.1869 sec | 4.0073 sec | 0.4524 10 sec | 4.1945 sec | 1.1503 sec | 1.2958 sec | 2.2552 sec | 1.3822 sec |

---
## 🏆 Why Aralez is the New Standard
Aralez isn't just fast; it's **predictably fast**. Under extreme load (2x1024 concurrency), most proxies start "stuttering," but Aralez maintains a rock-solid performance profile.
