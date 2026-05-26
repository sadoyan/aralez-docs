---
title: "Benchmarks"
description: "Aralez performance benchmarks vs Nginx, HAProxy, Envoy, Traefik, Caddy"
weight: 5
---

## Methodology and Profile

Benchmarks are performed by [Oha](https://github.com/hatoo/oha) HTTP benchmark tool.

**Proxies tested:** Aralez Glibc, Aralez Musl, HAProxy, Envoy, NginX, Traefik, Caddy

**Load profile:**

- Proxy servers running on same host with different ports
- 4× Oha instances for parallel testing of GET/POST requests
- 3× Upstream servers on separate machines with sample JSON file responses
- Tuned Kernel parameters for heavy load
- 10 Gbit network
- All instances: 4 Core+HT Intel Xeon CPU E5-2699C v4 @ 2.20GHz
- 60 URLs (deep / nested paths), majority HTTPS (TLS termination active)
- Mixed GET + POST, JSON payload for POST
- 4 × 1024 / 2048 / 4096 / 8192 / 16384 / 32768 concurrent connections
- Upstreams on separate machines, no caching

---

## Benchmark Results

Results shown are from 1 of 4 concurrent Oha instances. **Success Rate** includes all responses (2xx, 4xx, 5xx); real success rates are lower for all servers.

- Raw results: [GitHub](https://github.com/sadoyan/aralez-docs/tree/main/static/images/stresstest/resuls)
- Config files: [GitHub](https://github.com/sadoyan/aralez-docs/tree/main/static/images/stresstest/configs)

### Requests per Second Chart

![Grafana Dashboard](https://aralez.rs/images/stresstest/grafana.png)

---

#### 1024 Connections

| Server | success | avg ms | avg rps | p50 (ms) | p75 (ms) | p90 (ms) | p99 (ms) | resp 2xx | resp 5xx | timeout |
|---|---|---|---|---|---|---|---|---|---|---|
| Aralez Glibc | 100.00% | 181.26 | 5647.36 | 113.43 | 214.51 | 350.34 | 3766.54 | 1693385 | 15 | 0 |
| Aralez Musl | 100.00% | 222.25 | 4608.02 | 202.44 | 271.54 | 346.16 | 736.15 | 1381543 | 0 | 0 |
| HAProxy | 100.00% | 194.88 | 5253.44 | 140.18 | 234.96 | 364.24 | 947.78 | 1575185 | 0 | 0 |
| Envoy | 100.00% | 296.80 | 3449.66 | 236.70 | 390.55 | 568.72 | 1214.76 | 867123 | 65 | 0 |
| Nginx | 100.00% | 104.77 | 9760.28 | 25.09 | 63.53 | 270.73 | 1004.30 | 2927406 | 14 | 0 |
| Traefik | 100.00% | 340.62 | 3005.66 | 288.95 | 443.04 | 667.12 | 3518.50 | 900769 | 0 | 0 |
| Caddy | 100.00% | 489.99 | 2081.51 | 385.36 | 601.50 | 886.57 | 2823.21 | 624070 | 0 | 0 |

#### 2048 Connections

| Server | success | avg ms | avg rps | p50 (ms) | p75 (ms) | p90 (ms) | p99 (ms) | resp 2xx | resp 5xx | timeout |
|---|---|---|---|---|---|---|---|---|---|---|
| Aralez Glibc | 100.00% | 394.26 | 5180.70 | 278.78 | 502.41 | 779.27 | 2122.70 | 1552145 | 382 | 0 |
| Aralez Musl | 99.70% | 488.59 | 4080.99 | 466.45 | 654.94 | 891.07 | 1320.61 | 1218976 | 0 | 3642 |
| HAProxy | 100.00% | 419.82 | 4878.37 | 389.70 | 490.35 | 616.21 | 1217.53 | 1461844 | 0 | 0 |
| Envoy | 100.00% | 603.24 | 3395.66 | 527.87 | 778.52 | 1076.81 | 2056.96 | 852737 | 324 | 0 |
| Nginx | 100.00% | 205.15 | 9925.74 | 37.30 | 242.92 | 483.67 | 1949.74 | 2919024 | 57271 | 0 |
| Traefik | 99.93% | 972.92 | 2099.53 | 817.55 | 1277.94 | 1826.35 | 3537.44 | 627495 | 0 | 0 |
| Caddy | 99.90% | 1235.62 | 1650.86 | 1110.20 | 1642.78 | 2191.51 | 3671.22 | 492795 | 4 | 0 |

#### 4096 Connections

| Server | success | avg ms | avg rps | p50 (ms) | p75 (ms) | p90 (ms) | p99 (ms) | resp 2xx | resp 5xx | timeout |
|---|---|---|---|---|---|---|---|---|---|---|
| Aralez Glibc | 99.54% | 714.95 | 5551.66 | 643.93 | 914.60 | 1462.53 | 8008.12 | 1653036 | 1470 | 7453 |
| Aralez Musl | 99.14% | 772.00 | 5069.68 | 790.36 | 1002.27 | 1543.57 | 2025.12 | 1504373 | 6 | 12994 |
| HAProxy | 99.94% | 758.26 | 5385.17 | 642.38 | 789.03 | 1049.12 | 2166.36 | 1611271 | 0 | 1021 |
| Envoy | 99.99% | 1109.12 | 3694.40 | 990.68 | 1399.23 | 1898.20 | 6220.02 | 925971 | 744 | 60 |
| Nginx | 99.97% | 323.50 | 12149.03 | 51.52 | 256.51 | 1010.59 | 3744.67 | 1878704 | 1762285 | 526 |
| Traefik | 98.57% | 2081.61 | 1923.43 | 1719.45 | 2745.89 | 3957.28 | 7673.65 | 564861 | 96 | 8189 |
| Caddy | 94.11% | 2911.85 | 3697.57 | 2911.85 | 3697.57 | 4764.45 | 7339.34 | 359695 | 19 | 22531 |

#### 8192 Connections

| Server | success | avg ms | avg rps | p50 (ms) | p75 (ms) | p90 (ms) | p99 (ms) | resp 2xx | resp 5xx | timeout |
|---|---|---|---|---|---|---|---|---|---|---|
| Aralez Glibc | 96.72% | 1433.87 | 5229.03 | 1172.38 | 1836.76 | 2913.85 | 6847.36 | 1510144 | 333 | 49894 |
| Aralez Musl | 93.85% | 1351.05 | 4701.61 | 1005.49 | 1529.55 | 2591.60 | 7868.02 | 1310386 | 6474 | 85228 |
| HAProxy | 98.59% | 1566.06 | 5071.51 | 1277.94 | 1581.67 | 2624.46 | 4748.58 | 1493989 | 0 | 21314 |
| Envoy | 99.44% | 2305.49 | 3537.89 | 2024.74 | 2852.35 | 3912.80 | 8464.26 | 877059 | 1227 | 5849 |
| Nginx | 99.70% | 660.06 | 10492.42 | 89.72 | 367.11 | 941.47 | 11447.54 | 1379515 | 1753253 | 4626 |
| Traefik | 91.60% | 4886.61 | 1651.89 | 4051.81 | 6156.23 | 9065.90 | 18780.24 | 437343 | 9345 | 40930 |
| Caddy | 73.62% | 5635.97 | 1489.02 | 5217.81 | 7159.80 | 9142.49 | 27277.43 | 296697 | 26342 | 115768 |

#### 16384 Connections

| Server | success | avg ms | avg rps | p50 (ms) | p75 (ms) | p90 (ms) | p99 (ms) | resp 2xx | resp 5xx | timeout |
|---|---|---|---|---|---|---|---|---|---|---|
| Aralez Glibc | 91.82% | 1889.47 | 7239.63 | 1419.06 | 2030.44 | 3545.49 | 8970.15 | 1974545 | 8115 | 175656 |
| Aralez Musl | 74.66% | 1695.11 | 6182.74 | 958.54 | 1978.72 | 3421.58 | 6903.34 | 1368786 | 5553 | 466256 |
| HAProxy | 87.25% | 2847.87 | 5214.37 | 2529.60 | 2875.75 | 3651.98 | 9037.74 | 1353680 | 0 | 197139 |
| Envoy | 9.55% | 21293.72 | 1965.85 | 17130.98 | 25874.43 | 34067.07 | 176650.66 | 8587 | 30515 | 514554 |
| Nginx | 93.04% | 1532.27 | 8180.35 | 247.81 | 717.42 | 2268.38 | 25872.09 | 748877 | 1523376 | 165484 |
| Traefik | 44.44% | 4711.91 | 3278.25 | 4507.27 | 6075.64 | 7802.02 | 13300.41 | 368231 | 61992 | 537829 |
| Caddy | 31.50% | 8346.07 | 2642.76 | 5980.04 | 8726.91 | 16638.25 | 41544.60 | 185650 | 59164 | 532284 |

#### 32768 Connections

| Server | success | avg ms | avg rps | p50 (ms) | p75 (ms) | p90 (ms) | p99 (ms) | resp 2xx | resp 5xx | timeout |
|---|---|---|---|---|---|---|---|---|---|---|
| Aralez Glibc | 58.48% | 2775.65 | 6321.60 | 261.88 | 738.67 | 5234.50 | 60960.45 | 1072450 | 19642 | 775444 |
| Aralez Musl | 60.46% | 2235.21 | 6415.63 | 565.80 | 1043.59 | 1980.83 | 24646.15 | 1133334 | 13137 | 749662 |
| HAProxy | 88.52% | 1924.51 | 12838.52 | 1013.03 | 2366.78 | 4008.43 | 14302.46 | 680607 | 2712252 | 431990 |
| Envoy | 14.70% | 15870.07 | 3088.23 | 14057.15 | 21222.49 | 29508.97 | 50472.22 | 46855 | 60448 | 766423 |
| Nginx | 76.67% | 4129.21 | 6839.43 | 716.12 | 2243.58 | 8407.53 | 69057.59 | 256932 | 1298022 | 404111 |
| Traefik | 46.33% | 4702.81 | 5665.27 | 3784.63 | 5219.31 | 7536.46 | 25643.20 | 378926 | 395945 | 896315 |
| Caddy | 46.21% | 5589.78 | 5597.03 | 1645.92 | 5798.72 | 15067.89 | 42540.05 | 514763 | 247612 | 887458 |

---

## Comparison Charts

![Latency Comparison](https://aralez.rs/images/stresstest/latency.png)

![Requests per Second](https://aralez.rs/images/stresstest/rps.png)

![Success Rate](https://aralez.rs/images/stresstest/successrate.png)

---

## High-Level Summary

**Aralez** — Best throughput plus stability in a single measure. Stable under high load with predictable behavior.

**HAProxy** — Very consistent, predictable scaling. Strong under mixed workload.

**NginX** — Best throughput for low concurrent connections. Fails at high connection counts with many 5xx errors.

**Envoy** — Stable for low concurrent connections.

**Traefik** — Predictable behavior on low concurrent connections. Lower requests per second.

**Caddy** — Low requests per second ratio. Unstable under high loads, predictable on low loads.
