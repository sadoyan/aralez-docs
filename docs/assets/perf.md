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
| Server       | success | average ms | average rps | p50 (ms) | p75 (ms) | p90 (ms) | p99 (ms) | resp 2xx | resp 5xx | resp 4xx | timeout | conn error | closed |
|--------------|--------------|  --- |  --- |  --- |  --- |  --- |  --- |  --- |  --- |  --- |  --- |  --- |  --- | 
| Aralez Glibc | 100.00%      | 181.2605 | 5647.355 | 113.4275 | 214.506 | 350.3418 | 3766.5374 | 1693385 | 15 | 0 | 0 | 8 | 0 |
| Aralez Musl  | 100.00%      | 222.2525 | 4608.0181 | 202.4398 | 271.5406 | 346.1647 | 736.1494 | 1381543 | 0 | 0 | 0 | 0 | 0 |
| HAProxy      | 100.00%      | 194.8784 | 5253.4379 | 140.1771 | 234.9557 | 364.236 | 947.779 | 1575185 | 0 | 0 | 0 | 0 | 0 |
| Envoy        | 100.00%      | 296.7965 | 3449.6564 | 236.6995 | 390.5484 | 568.7159 | 1214.764 | 867123 | 65 | 166822 | 0 | 0 | 0 |
| Nginx        | 100.00%      | 104.7666 | 9760.2779 | 25.0937 | 63.5301 | 270.7325 | 1004.2985 | 2927406 | 14 | 0 | 0 | 0 | 0 |
| Traefik      | 100.00%      | 340.6176 | 3005.6584 | 288.9491 | 443.0434 | 667.1151 | 3518.5015 | 900769 | 0 | 0 | 0 | 0 | 0 |
| Caddy        | 100.00%      | 465.269 | 2201.6289 | 387.8206 | 623.1936 | 920.5608 | 1610.1037 | 659538 | 1 | 0 | 0 | 3 | 0 |

#### 2048 Concurrent Connections

| Server       | success | average ms | average rps | p50 (ms) | p75 (ms) | p90 (ms) | p99 (ms) | resp 2xx | resp 5xx | resp 4xx | timeout | conn error | closed |
|--------------|--------------|  --- |  --- |  --- |  --- |  --- |  --- |  --- |  --- |  --- |  --- |  --- |  --- | 
| Aralez Glibc | 100.00% | 394.2646 | 5180.7017 | 278.776 | 502.4143 | 779.2661 | 2122.6964 | 1552145 | 382 | 0 | 0 | 16 | 0 |
| Aralez Musl | 99.70% | 488.593 | 4080.9874 | 466.4452 | 654.9382 | 891.0665 | 1320.6147 | 1218976 | 0 | 0 | 3642 | 0 | 0 |
| HAProxy | 100.00% | 419.8158 | 4878.3719 | 389.6962 | 490.3482 | 616.2081 | 1217.5277 | 1461844 | 0 | 0 | 0 | 0 | 0 |
| Envoy | 100.00% | 603.241 | 3395.6564 | 527.8686 | 778.5179 | 1076.8118 | 2056.9565 | 852737 | 324 | 163843 | 0 | 0 | 0 |
| Nginx | 100.00% | 205.1519 | 9925.744 | 37.3003 | 242.924 | 483.666 | 1949.7389 | 2919024 | 57271 | 0 | 0 | 60 | 10 |
| Traefik | 99.93% | 972.9245 | 2099.5312 | 817.5549 | 1277.94 | 1826.3545 | 3537.438 | 627495 | 0 | 8 | 0 | 456 | 1 |
| Caddy | 99.90% | 1235.6155 | 1650.8596 | 1110.2041 | 1642.775 | 2191.509 | 3671.2179 | 492795 | 4 | 0 | 511 | 4 | 0 |

#### 4096 Concurrent Connections

| Server       | success | average ms | average rps | p50 (ms) | p75 (ms) | p90 (ms) | p99 (ms) | resp 2xx | resp 5xx | resp 4xx | timeout | conn error | closed |
|--------------|--------------|  --- |  --- |  --- |  --- |  --- |  --- |  --- |  --- |  --- |  --- |  --- |  --- | 
| Aralez Glibc | 99.54% | 714.9515 | 5551.6624 | 643.9289 | 914.6006 | 1462.5255 | 8008.1168 | 1653036 | 1470 | 0 | 7453 | 167 | 0 |
| Aralez Musl | 99.14% | 772.0005 | 5069.6826 | 790.3593 | 1002.2698 | 1543.5676 | 2025.1174 | 1504373 | 6 | 0 | 12994 | 0 | 0 |
| HAProxy | 99.94% | 758.2621 | 5385.1665 | 642.3769 | 789.0288 | 1049.115 | 2166.359 | 1611271 | 0 | 0 | 1021 | 3 | 6 |
| Envoy | 99.99% | 1109.1196 | 3694.396 | 990.6764 | 1399.2273 | 1898.1962 | 6220.0171 | 925971 | 744 | 178044 | 60 | 0 | 0 |
| Nginx | 99.97% | 323.5027 | 12149.0327 | 51.5151 | 256.5136 | 1010.59 | 3744.6661 | 1878704 | 1762285 | 0 | 526 | 461 | 170 |
| Traefik | 98.57% | 2081.6082 | 1923.429 | 1719.4499 | 2745.8877 | 3957.2772 | 7673.6517 | 564861 | 96 | 0 | 8189 | 15 | 0 |
| Caddy | 94.11% | 2911.8452 | 3697.5715 | 2911.8452 | 3697.5715 | 4764.4534 | 7339.3418 | 359695 | 19 | 0 | 22531 | 1 | 0 |

#### 8192 Concurrent Connections

| Server       | success | average ms | average rps | p50 (ms) | p75 (ms) | p90 (ms) | p99 (ms) | resp 2xx | resp 5xx | resp 4xx | timeout | conn error | closed |
|--------------|--------------|  --- |  --- |  --- |  --- |  --- |  --- |  --- |  --- |  --- |  --- |  --- |  --- | 
| Aralez Glibc | 96.72% | 1433.865 | 5229.0337 | 1172.379 | 1836.7599 | 2913.8494 | 6847.3585 | 1510144 | 333 | 0 | 49894 | 1397 | 0 |
| Aralez Musl | 93.85% | 1351.0483 | 4701.6137 | 1005.4935 | 1529.5507 | 2591.5969 | 7868.0168 | 1310386 | 6474 | 0 | 85228 | 1048 | 2 |
| HAProxy | 98.59% | 1566.0619 | 5071.5138 | 1277.9395 | 1581.6739 | 2624.4561 | 4748.5795 | 1493989 | 0 | 0 | 21314 | 35 | 33 |
| Envoy | 99.44% | 2305.4896 | 3537.8927 | 2024.7415 | 2852.3525 | 3912.7998 | 8464.2608 | 877059 | 1227 | 170325 | 5849 | 16 | 0 |
| Nginx | 99.70% | 660.0597 | 10492.4242 | 89.724 | 367.1117 | 941.4656 | 11447.5366 | 1379515 | 1753253 | 0 | 4626 | 1974 | 2858 |
| Traefik | 91.60% | 4886.6063 | 1651.885 | 4051.8129 | 6156.2306 | 9065.899 | 18780.2409 | 437343 | 9345 | 0 | 40930 | 30 | 0 |
| Caddy | 73.62% | 5635.9696 | 1489.0166 | 5217.8075 | 7159.8022 | 9142.491 | 27277.4433 | 296697 | 26342 | 0 | 115768 | 0 | 0 |

#### 16384 Concurrent Connections

| Server       | success | average ms | average rps | p50 (ms) | p75 (ms) | p90 (ms) | p99 (ms) | resp 2xx | resp 5xx | resp 4xx | timeout | conn error | closed |
|--------------|--------------|  --- |  --- |  --- |  --- |  --- |  --- |  --- |  --- |  --- |  --- |  --- |  --- | 
| Aralez Glibc | 91.82% | 1889.471 | 7239.6264 | 1419.0587 | 2030.4376 | 3545.4887 | 8970.148 | 1974545 | 8115 | 0 | 175656 | 873 | 0 |
| Aralez Musl | 74.66% | 1695.1143 | 6182.7386 | 958.5373 | 1978.7169 | 3421.584 | 6903.3388 | 1368786 | 5553 | 0 | 466256 | 240 | 0 |
| HAProxy | 87.25% | 2847.8653 | 5214.372 | 2529.5994 | 2875.7507 | 3651.9785 | 9037.7449 | 1353680 | 0 | 0 | 197139 | 403 | 302 |
| Envoy | 9.55% | 21293.7248 | 1965.8489 | 17130.9835 | 25874.4273 | 34067.0651 | 176650.6606 | 8587 | 30515 | 15724 | 514554 | 0 | 4590 |
| Nginx | 93.04% | 1532.267 | 8180.3502 | 247.8105 | 717.4157 | 2268.379 | 25872.0913 | 748877 | 1523376 | 0 | 165484 | 2229 | 2166 |
| Traefik | 44.44% | 4711.9077 | 3278.2479 | 4507.2743 | 6075.6405 | 7802.0159 | 13300.4058 | 368231 | 61992 | 0 | 537829 | 26 | 0 |
| Caddy | 31.50% | 8346.0683 | 2642.7568 | 5980.0388 | 8726.9127 | 16638.2492 | 41544.6009 | 185650 | 59164 | 0 | 532284 | 0 | 0 |

#### 32768 Concurrent Connections

| Server       | success | average ms | average rps | p50 (ms) | p75 (ms) | p90 (ms) | p99 (ms) | resp 2xx | resp 5xx | resp 4xx | timeout | conn error | closed |
|--------------|--------------|  --- |  --- |  --- |  --- |  --- |  --- |  --- |  --- |  --- |  --- |  --- |  --- | 
| Aralez Glibc | 58.48% | 2775.6542 | 6321.6025 | 261.8794 | 738.6677 | 5234.5041 | 60960.4514 | 1072450 | 19642 | 0 | 775444 | 54 | 0 |
| Aralez Musl | 60.46% | 2235.2099 | 6415.6311 | 565.7982 | 1043.5883 | 1980.8332 | 24646.1483 | 1133334 | 13137 | 0 | 749662 | 12 | 0 |
| HAProxy | 88.52% | 1924.5097 | 12838.5249 | 1013.0308 | 2366.78 | 4008.4256 | 14302.4625 | 680607 | 2712252 | 5 | 431990 | 7964 | 25 |
| Envoy | 14.70% | 15870.0727 | 3088.2342 | 14057.1459 | 21222.4869 | 29508.9678 | 50472.2189 | 46855 | 60448 | 25085 | 766423 | 1917 | 0 |
| Nginx | 76.67% | 4129.2141 | 6839.4286 | 716.1242 | 2243.5775 | 8407.5327 | 69057.5854 | 256932 | 1298022 | 0 | 404111 | 43727 | 25419 |
| Traefik | 46.33% | 4702.8135 | 5665.2674 | 3784.6281 | 5219.3121 | 7536.4557 | 25643.2011 | 378926 | 395945 | 0 | 896315 | 38 | 0 |
| Caddy | 46.21% | 5589.7828 | 5597.0277 | 1645.9229 | 5798.7206 | 15067.8908 | 42540.0489 | 514763 | 247612 | 0 | 887458 | 0 | 0 |

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


