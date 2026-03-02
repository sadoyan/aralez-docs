## 🚀 Aralez performance benchmarks
---

### 💡 Simple benchmark by [Oha](https://github.com/hatoo/oha)

### **Reverse Proxy Mixed Load Benchmark**

#### **Test Overview**

**Proxies tested:**

* Aralez Glibc
* Aralez Musl
* HAProxy
* Envoy
* NginX
* Traefik
* Caddy

**Load profile:**

* Proxy servers running on same host with different ports
* 4x Oha instances for parallel testing of GET/POST requests
* 3x Upstream servers on separate machines with responses per 3 domains with sample json files
* Tuned Kernel parameters for heavy load
* 10 gbit network
* All instances running 4 Core+HT Intel(R) Xeon(R) CPU E5-2699C v4 @ 2.20GHz 
* 60 URLs (deep / nested paths)
* Majority HTTPS (TLS termination active)
* Mixed GET + POST 2x Oha instances with POST requests and 2x for GET on the same set of URLs. 
* JSON payload for POST
* 4 × 1024/2048/4096/8192/16384/32768 concurrent connections.
* Upstreams on separate machines
* No caching
* Mixed routing and domain handling

### Load Balancer Performance Benchmark Results

Below are summary tables representing results of 1 from 4 concurrent running oha instances. 
**Success Rate** represents any successfull responses including 5xx and 4xx. 
So the real success rates are lower for all servers.   

* Raw results can be found **[here](https://github.com/sadoyan/aralez-docs/tree/main/docs/images/stresstest/resuls)**.  
* Configuration files of all servers are **[here](https://github.com/sadoyan/aralez-docs/tree/main/docs/images/stresstest/configs)**

### **Requests per second chart during test**
![Aralez](https://raw.githubusercontent.com/sadoyan/aralez-docs/refs/heads/main/docs/images/stresstest/grafana.png)

# Load Balancer Benchmark Results

### **Summary of Results**

#### 1024 Concurrent Connections

| service      |   success rate |   average ms |   average rps |   p50 (ms) |   p75 (ms) |   p90 (ms) |   p99 (ms) |         resp 2xx |   resp 5xx |   resp 4xx |   conn timeout |   conn error |   conn closed |
|-------------|---------------|-------------|--------------|-----------|-----------|-----------|-----------|-----------------|-----------|-----------|---------------|-------------|--------------|
| Aralez Glibc |            100 |      181.261 |       5647.35 |   113.427  |   214.506  |    350.342 |   3766.54  |      1.69338e+06 |         15 |          0 |              0 |            8 |             0 |
| Aralez Musl  |            100 |      222.252 |       4608.02 |   202.44   |   271.541  |    346.165 |    736.149 |      1.38154e+06 |          0 |          0 |              0 |            0 |             0 |
| HAProxy      |            100 |      194.878 |       5253.44 |   140.177  |   234.956  |    364.236 |    947.779 |      1.57518e+06 |          0 |          0 |              0 |            0 |             0 |
| Envoy        |            100 |      296.796 |       3449.66 |   236.7    |   390.548  |    568.716 |   1214.76  | 867123           |         65 |     166822 |              0 |            0 |             0 |
| Nginx        |            100 |      104.767 |       9760.28 |    25.0937 |    63.5301 |    270.733 |   1004.3   |      2.92741e+06 |         14 |          0 |              0 |            0 |             0 |
| Traefik      |            100 |      340.618 |       3005.66 |   288.949  |   443.043  |    667.115 |   3518.5   | 900769           |          0 |          0 |              0 |            0 |             0 |
| Caddy        |            100 |      465.269 |       2201.63 |   387.821  |   623.194  |    920.561 |   1610.1   | 659538           |          1 |          0 |              0 |            3 |             0 |

#### 2048 Concurrent Connections

| service      |   success rate |   average ms |   average rps |   p50 (ms) |   p75 (ms) |   p90 (ms) |   p99 (ms) |         resp 2xx |   resp 5xx |   resp 4xx |   conn timeout |   conn error |   conn closed |
|-------------|---------------|-------------|--------------|-----------|-----------|-----------|-----------|-----------------|-----------|-----------|---------------|-------------|--------------|
| Aralez Glibc |         100    |      394.265 |       5180.7  |   278.776  |    502.414 |    779.266 |    2122.7  |      1.55214e+06 |        382 |          0 |              0 |           16 |             0 |
| Aralez Musl  |          99.7  |      488.593 |       4080.99 |   466.445  |    654.938 |    891.067 |    1320.61 |      1.21898e+06 |          0 |          0 |           3642 |            0 |             0 |
| HAProxy      |         100    |      419.816 |       4878.37 |   389.696  |    490.348 |    616.208 |    1217.53 |      1.46184e+06 |          0 |          0 |              0 |            0 |             0 |
| Envoy        |         100    |      603.241 |       3395.66 |   527.869  |    778.518 |   1076.81  |    2056.96 | 852737           |        324 |     163843 |              0 |            0 |             0 |
| Nginx        |         100    |      205.152 |       9925.74 |    37.3003 |    242.924 |    483.666 |    1949.74 |      2.91902e+06 |      57271 |          0 |              0 |           60 |            10 |
| Traefik      |          99.93 |      972.924 |       2099.53 |   817.555  |   1277.94  |   1826.35  |    3537.44 | 627495           |          0 |          8 |              0 |          456 |             1 |
| Caddy        |          99.9  |     1235.62  |       1650.86 |  1110.2    |   1642.78  |   2191.51  |    3671.22 | 492795           |          4 |          0 |            511 |            4 |             0 |

#### 4096 Concurrent Connections

| service      |   success rate |   average ms |   average rps |   p50 (ms) |   p75 (ms) |   p90 (ms) |   p99 (ms) |         resp 2xx |       resp 5xx |   resp 4xx |   conn timeout |   conn error |   conn closed |
|-------------|---------------|-------------|--------------|-----------|-----------|-----------|-----------|-----------------|---------------|-----------|---------------|-------------|--------------|
| Aralez Glibc |          99.54 |      714.952 |       5551.66 |   643.929  |    914.601 |    1462.53 |    8008.12 |      1.65304e+06 | 1470           |          0 |           7453 |          167 |             0 |
| Aralez Musl  |          99.14 |      772     |       5069.68 |   790.359  |   1002.27  |    1543.57 |    2025.12 |      1.50437e+06 |    6           |          0 |          12994 |            0 |             0 |
| HAProxy      |          99.94 |      758.262 |       5385.17 |   642.377  |    789.029 |    1049.12 |    2166.36 |      1.61127e+06 |    0           |          0 |           1021 |            3 |             6 |
| Envoy        |          99.99 |     1109.12  |       3694.4  |   990.676  |   1399.23  |    1898.2  |    6220.02 | 925971           |  744           |     178044 |             60 |            0 |             0 |
| Nginx        |          99.97 |      323.503 |      12149    |    51.5151 |    256.514 |    1010.59 |    3744.67 |      1.8787e+06  |    1.76228e+06 |          0 |            526 |          461 |           170 |
| Traefik      |          98.57 |     2081.61  |       1923.43 |  1719.45   |   2745.89  |    3957.28 |    7673.65 | 564861           |   96           |          0 |           8189 |           15 |             0 |
| Caddy        |          94.11 |     2911.85  |       3697.57 |  2911.85   |   3697.57  |    4764.45 |    7339.34 | 359695           |   19           |          0 |          22531 |            1 |             0 |

#### 8192 Concurrent Connections

| service      |   success rate |   average ms |   average rps |   p50 (ms) |   p75 (ms) |   p90 (ms) |   p99 (ms) |         resp 2xx |        resp 5xx |   resp 4xx |   conn timeout |   conn error |   conn closed |
|-------------|---------------|-------------|--------------|-----------|-----------|-----------|-----------|-----------------|----------------|-----------|---------------|-------------|--------------|
| Aralez Glibc |          96.72 |      1433.87 |       5229.03 |   1172.38  |   1836.76  |   2913.85  |    6847.36 |      1.51014e+06 |   333           |          0 |          49894 |         1397 |             0 |
| Aralez Musl  |          93.85 |      1351.05 |       4701.61 |   1005.49  |   1529.55  |   2591.6   |    7868.02 |      1.31039e+06 |  6474           |          0 |          85228 |         1048 |             2 |
| HAProxy      |          98.59 |      1566.06 |       5071.51 |   1277.94  |   1581.67  |   2624.46  |    4748.58 |      1.49399e+06 |     0           |          0 |          21314 |           35 |            33 |
| Envoy        |          99.44 |      2305.49 |       3537.89 |   2024.74  |   2852.35  |   3912.8   |    8464.26 | 877059           |  1227           |     170325 |           5849 |           16 |             0 |
| Nginx        |          99.7  |       660.06 |      10492.4  |     89.724 |    367.112 |    941.466 |   11447.5  |      1.37952e+06 |     1.75325e+06 |          0 |           4626 |         1974 |          2858 |
| Traefik      |          91.6  |      4886.61 |       1651.88 |   4051.81  |   6156.23  |   9065.9   |   18780.2  | 437343           |  9345           |          0 |          40930 |           30 |             0 |
| Caddy        |          73.62 |      5635.97 |       1489.02 |   5217.81  |   7159.8   |   9142.49  |   27277.4  | 296697           | 26342           |          0 |         115768 |            0 |             0 |

#### 16384 Concurrent Connections

| service      |   success rate |   average ms |   average rps |   p50 (ms) |   p75 (ms) |   p90 (ms) |   p99 (ms) |         resp 2xx |        resp 5xx |   resp 4xx |   conn timeout |   conn error |   conn closed |
|-------------|---------------|-------------|--------------|-----------|-----------|-----------|-----------|-----------------|----------------|-----------|---------------|-------------|--------------|
| Aralez Glibc |          91.82 |      1889.47 |       7239.63 |   1419.06  |   2030.44  |    3545.49 |    8970.15 |      1.97454e+06 |  8115           |          0 |         175656 |          873 |             0 |
| Aralez Musl  |          74.66 |      1695.11 |       6182.74 |    958.537 |   1978.72  |    3421.58 |    6903.34 |      1.36879e+06 |  5553           |          0 |         466256 |          240 |             0 |
| HAProxy      |          87.25 |      2847.87 |       5214.37 |   2529.6   |   2875.75  |    3651.98 |    9037.74 |      1.35368e+06 |     0           |          0 |         197139 |          403 |           302 |
| Envoy        |           9.55 |     21293.7  |       1965.85 |  17131     |  25874.4   |   34067.1  |  176651    |   8587           | 30515           |      15724 |         514554 |            0 |          4590 |
| Nginx        |          93.04 |      1532.27 |       8180.35 |    247.81  |    717.416 |    2268.38 |   25872.1  | 748877           |     1.52338e+06 |          0 |         165484 |         2229 |          2166 |
| Traefik      |          44.44 |      4711.91 |       3278.25 |   4507.27  |   6075.64  |    7802.02 |   13300.4  | 368231           | 61992           |          0 |         537829 |           26 |             0 |
| Caddy        |          31.5  |      8346.07 |       2642.76 |   5980.04  |   8726.91  |   16638.2  |   41544.6  | 185650           | 59164           |          0 |         532284 |            0 |             0 |

#### 32768 Concurrent Connections

| service      |   success rate |   average ms |   average rps |   p50 (ms) |   p75 (ms) |   p90 (ms) |   p99 (ms) |         resp 2xx |         resp 5xx |   resp 4xx |   conn timeout |   conn error |   conn closed |
|-------------|---------------|-------------|--------------|-----------|-----------|-----------|-----------|-----------------|-----------------|-----------|---------------|-------------|--------------|
| Aralez Glibc |          58.48 |      2775.65 |       6321.6  |    261.879 |    738.668 |    5234.5  |    60960.5 |      1.07245e+06 |  19642           |          0 |         775444 |           54 |             0 |
| Aralez Musl  |          60.46 |      2235.21 |       6415.63 |    565.798 |   1043.59  |    1980.83 |    24646.1 |      1.13333e+06 |  13137           |          0 |         749662 |           12 |             0 |
| HAProxy      |          88.52 |      1924.51 |      12838.5  |   1013.03  |   2366.78  |    4008.43 |    14302.5 | 680607           |      2.71225e+06 |          5 |         431990 |         7964 |            25 |
| Envoy        |          14.7  |     15870.1  |       3088.23 |  14057.1   |  21222.5   |   29509    |    50472.2 |  46855           |  60448           |      25085 |         766423 |         1917 |             0 |
| Nginx        |          76.67 |      4129.21 |       6839.43 |    716.124 |   2243.58  |    8407.53 |    69057.6 | 256932           |      1.29802e+06 |          0 |         404111 |        43727 |         25419 |
| Traefik      |          46.33 |      4702.81 |       5665.27 |   3784.63  |   5219.31  |    7536.46 |    25643.2 | 378926           | 395945           |          0 |         896315 |           38 |             0 |
| Caddy        |          46.21 |      5589.78 |       5597.03 |   1645.92  |   5798.72  |   15067.9  |    42540   | 514763           | 247612           |          0 |         887458 |            0 |             0 |

## 📊 Comparison charts

![Latency](https://raw.githubusercontent.com/sadoyan/aralez-docs/refs/heads/main/docs/images/stresstest/latency.png)
![Requests Per Seond](https://raw.githubusercontent.com/sadoyan/aralez-docs/refs/heads/main/docs/images/stresstest/rps.png)
![Requests Per Seond](https://raw.githubusercontent.com/sadoyan/aralez-docs/refs/heads/main/docs/images/stresstest/successrate.png)

### **High-Level Summary**

**Aralez**

* Best throughout plus stability in a single measure. 
* Stable under high load. 
* Predictable behavior. 

**HAProxy**

* Very consistent
* Predictable scaling
* Strong under mixed workload

**NginX**

* Best throughout fo low concurrent connections.
* Fails on high amount of connection, with lots of 5xx error

**Envoy**

* Stable for low concurrent connections. 

**Traefik**

* Predictable behavior on low concurrent connections. 
* Low requests per second handling. 

**Caddy**

* Low requests per second ratio.   
* Unstable under high loads. 
* Predictable on low loads 

---


