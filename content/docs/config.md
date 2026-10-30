---
title: "Configuration"
description: "Reference for main.yaml and upstreams.yaml"
weight: 2
---

## `main.yaml` — Startup Parameters

| Key                              | Example Value                                     | Description                                                                                                                                           |
|----------------------------------|---------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------|
| **threads**                      | `12`                                              | Number of worker threads assigned to proxy operations. Defaults to `1`.                                                                               |
| **runuser**                      | `aralez`                                          | Optional. Username to run as after dropping root privileges (requires launch as root).                                                                |
| **rungroup**                     | `aralez`                                          | Optional. Group to run as after dropping root privileges (requires launch as root).                                                                   |
| **cache**                        | Optional Block                                    | If omitted entirely, caching is disabled.                                                                                                             |
| **cache.storage**                | `hybrid`                                          | Storage backend: `"memory"`, `"hybrid"`, or `"redis://host:port"`. Defaults to `"memory"`.                                                            |
| **cache.mem_size_mb**            | `64`                                              | Optional. Memory cache tier limit in megabytes. Defaults to `64`.                                                                                     |
| **cache.file_size_mb**           | `128`                                             | Optional. Disk cache tier limit in megabytes (hybrid mode). Defaults to `512`.                                                                        |
| **cache.file_path**              | `/tmp/cache`                                      | Optional. Directory path for the disk cache tier. Defaults to `/tmp/aralez_cache`.                                                                    |
| **cache.item_max_size**          | `5`                                               | Optional. Maximum allowed size for a single cached item in megabytes. Defaults to `5`.                                                                |
| **cache.flush_interval**         | `60`                                              | Optional. Interval in seconds to flush memory cache states to disk (hybrid mode). Defaults to `60`.                                                   |
| **cache.ttl**                    | `300`                                             | Optional. Default TTL in seconds used when upstream Cache-Control headers are absent. Defaults to `300`.                                              |
| **upstream_keepalive_pool_size** | `500`                                             | Maximum number of keepalive connections pooled for upstream targets.                                                                                  |
| **pid_file**                     | `/tmp/aralez.pid`                                 | File system path where the daemon process ID is written.                                                                                              |
| **error_log**                    | `/tmp/aralez_err.log`                             | Optional. File path for directing standard error log output when enabled.                                                                             |
| **upgrade_sock**                 | `/tmp/aralez.sock`                                | Unix domain socket path used for zero-downtime binary upgrades and state handoffs.                                                                    |
| **config_api_enabled**           | `true`                                            | Boolean toggle to enable/disable remote runtime configuration push capability.                                                                        |
| **config_address**               | `0.0.0.0:3000`                                    | HTTP API bind address for pushing runtime config updates.                                                                                             |
| **proxy_address_http**           | `0.0.0.0:6193`                                    | Primary bind address and port for incoming plain-text HTTP proxy traffic.                                                                             |
| **proxy_address_tls**            | `0.0.0.0:6194`                                    | Optional bind address and port for incoming secure TLS proxy traffic.                                                                                 |
| **proxy_configs**                | `/etc/aralez`                                     | Path to directory containing SSL certs and keys in format `{NAME}.crt` and `{NAME}.key`.                                                              |
| **upstreams_conf**               | `/etc/aralez/upstreams.yaml`                      | File system path pointing to upstream service routing definitions.                                                                                    |
| **proxy_tls_grade**              | `high`                                            | Security grade of TLS cipher suite (`high`, `medium`, `unsafe`). `high` matches Qualys SSL Labs A+.                                                   |
| **file_server_folder**           | `/opt/public`                                     | Optional. Local file system directory to serve statically.                                                                                            |
| **file_server_address**          | `0.0.0.0:3002`                                    | Optional. Local bind address for static file server.                                                                                                  |
| **log_level**                    | `info`                                            | Global logging verbosity threshold (`info`, `warn`, `error`, `debug`, `trace`, `off`).                                                                |
| **access_log**                   | `all`                                             | Access logging mode (`all`, `error`). Omit/comment out to disable.                                                                                    |
| **log_pattern**                  | `{d(%Y-%m-%d %H:%M:%S)} {h({l})} - {t} - {m} {n}` | Optional custom log pattern. Defaults to `{d(%Y-%m-%d %H:%M:%S)} {l} - {m}{n}`.                                                                       |
| **log_file**                     | `/tmp/aralez.log, 20, 5, compress`                | Optional file logging config: path, max size (MB), rotated files to keep, compression.                                                                |
| **log_structured**               | `elasticsearch`                                   | Optional structured logging sink target (e.g., `elasticsearch`).                                                                                      |
| **acme_dns_provider**            | `cloudflare`                                      | DNS provider API integration for automated ACME DNS-01 challenges (`cloudflare`, `route53`, `digitalocean`).                                          |
| **hc_method**                    | `HEAD`                                            | HTTP health check method verb (`HEAD`, `GET`, `POST` in UPPERCASE).                                                                                   |
| **hc_interval**                  | `5`                                               | Time interval in seconds between periodic upstream health checks.                                                                                     |
| **cluster_member**               | `master`                                          | Optional. Operational role in multi-node cluster mode (`master`, `worker`).                                                                           |
| **worker_nodes**                 | `http://127.0.0.1:8000, http://127.0.0.1:4000`    | Required if `cluster_member: master`. Comma-separated worker management endpoints.                                                                    |
| **tcp**                          | Optional Block                                    | Optional advanced Linux TCP socket parameters. Do not alter unless tuned for specific network environments. Values shown act as operational defaults. |
| **tcp.tcp_keepalive_idle**       | `30`                                              | Seconds of socket inactivity before sending TCP keepalive probes. Defaults to `30`.                                                                   |
| **tcp.tcp_keepalive_interval**   | `10`                                              | Seconds between individual keepalive probes if no response. Defaults to `10`.                                                                         |
| **tcp.tcp_keepalive_count**      | `5`                                               | Maximum unanswered probes before declaring connection dead. Defaults to `5`.                                                                          |
| **tcp.so_reuseport**             | `true`                                            | Enables `SO_REUSEPORT` for multi-worker connection distribution without lock contention. Defaults to `true`.                                          |
| **tcp.tcp_fastopen**             | `4096`                                            | Enables TCP Fast Open backlog queue size. Set to `0` if unsupported by host kernel/container. Defaults to `4096`.                                     |

### Cluster Mode

- `master` Master node don't serve the live traffic. It runs the health checks and updates worker nodes.
- `worker` Worker nodes handles the traffic, but the health checks are completely tuened off. Worker nodes wil receive full status from master.
- Environment variable `MASTER_KEY` with the same value is required for both `master` and `worker` nodes.

Cluster mode is designed for high loaded career proxy farms where hundreds, 
or thousands of upstreams are configures and there is need to offload heavy health checks and type detections.
Currently, a single master is supported, Master consensus with full RAFT implementation is planned. 

### [Cache Documentation]({{% relref "/docs/cache" %}})

---

## `upstreams.yaml` — Upstream Mappings

- `provider`: `file` or `consul`
- File-based upstreams define hostnames, routing paths, backend servers, optional request headers
- Global headers (e.g. CORS) apply to all proxied responses
- Optional authentication (Basic, API Key, JWT)

---

## Example: File Provider

A sample `upstreams.yaml` entry:

```yaml
provider: "file"
sticky_sessions: 86000
to_https: false
rate_limit: 20
x4xx_limit: 10
server_headers:
  - "X-Forwarded-Proto:https"
  - "X-Forwarded-Port:443"
client_headers:
  - "Access-Control-Allow-Origin:*"
  - "Access-Control-Allow-Methods:POST, GET, OPTIONS"
  - "Access-Control-Max-Age:86400"
myhost.mydomain.com:
  paths:
    "/":
      rate_limit: 20
      x4xx_limit: 10
      to_https: false
      server_headers:
        - "X-Something-Else:Foobar"
        - "X-Another-Header:Hohohohoho"
      client_headers:
        - "X-Some-Thing:Yaaaaaaaaaaaaaaa"
        - "X-Proxy-From:Hopaaaaaaaaaaaar"
      servers:
        - "127.0.0.1:8000"
        - "127.0.0.2:8000"
    "/foo":
      to_https: true
      authorization:
        type: "jwt"
        data: "266463d1-210a-4787-9a81-4aacb37a8723"
      client_headers:
        - "X-Another-Header:Hohohohoho"
      servers:
        - "127.0.0.4:8443"
        - "127.0.0.5:8443"
    "/.well-known/acme-challenge":
      healthcheck: false
      servers:
        - "127.0.0.1:8001"
DEFAULT:
  paths:
    "/":
      servers:
        - "127.0.0.1:3000"
```

**This means:**

- Sticky sessions are enabled globally. This setting applies to all upstreams. If enabled the value withh be set for `Max-Age=` cookie.
- HTTP to HTTPS redirect disabled globally, but can be overridden by `to_https` setting per upstream.
- All upstreams will receive custom headers : `X-Forwarded-Proto:https` and `X-Forwarded-Port:443`
- Additionally, myhost.mydomain.com with path `/` will receive custom headers : `X-Another-Header:Hohohohoho` and `X-Something-Else:Foobar`
- Requests with response 4xx to each hosted domains will be limited to 20 requests per second per virtualhost.
    - Requests limits are calculated per requester ip plus requested virtualhost.
    - If the requester exceeds the limit it will receive `429 Too Many Requests` error.
    - Optional. Rate limiter will be disabled if the parameter is entirely removed from config.
- Requests to each hosted domains will be limited to 20 requests per second per virtualhost.
    - Requests limits are calculated per requester ip plus requested virtualhost.
    - If the requester exceeds the limit it will receive `429 Too Many Requests` error.
    - Optional. Rate limiter will be disabled if the parameter is entirely removed from config.
- Requests to `myhost.mydomain.com/` will be limited to 20 requests per second.
- Requests with 4xx responses to `myhost.mydomain.com/` will be limited to 10 requests per second.
- Requests to `myhost.mydomain.com/` will be proxied to `127.0.0.1` and `127.0.0.2`.
- Plain HTTP to `myhost.mydomain.com/foo` will get 301 redirect to configured TLS port of Aralez.
- `myhost.mydomain.com/foo` will require authentication with JWT token, signed by `266463d1-210a-4787-9a81-4aacb37a8723`.
- Requests to `myhost.mydomain.com/foo` will be proxied to `127.0.0.4` and `127.0.0.5`.
- Requests to `myhost.mydomain.com/.well-known/acme-challenge` will be proxied to `127.0.0.1:8001`, but healthcheks are disabled.
- SSL/TLS for upstreams is detected automatically, no need to set any config parameter.
    - Assuming the `127.0.0.5:8443` is SSL protected. The inner traffic will use TLS.
    - Self-signed certificates are silently accepted.
- Global headers (CORS for this case) will be injected to all upstreams.
- Additional headers will be injected into the request for `myhost.mydomain.com`.
- You can choose any path, deep nested paths are supported, the best match chosen.
- `DEFAULT` catch up everything else and proxy to `127.0.0.1:3000`
    - This is a special upstream and in order to do the catch-up jub it must be **DEFAULT** all capitals

**Special note if healthcheks are disabled.**

Aralez internally detects upstreams TLS, H2, gRPS status during healtchecks. With disabled healtchecks `is_http2` and `is_ssl` defaults to false.
Fix these settings manually in accordance tou your upstreams server's protocols inside `upstreams.yaml`

**Example**

```yaml
  www.yourdomain.com:
    paths:
      "/":
        healthcheck: false
        is_http2: true
        is_ssl: true
        servers:
          - "127.0.0.1:443"
```

- To enable gRPC proxy set `is_http2: true` .

---
Since Version v.0.86.1 upstream config can be split to multiple files. Aralez will scan `conf.d` subdirectory in configuration directory and include all `yaml` files.
Naming of files is not matter, it just needs to have extension `.yaml` . The content of file is similar to `upstreams.yaml` file with some minor differences .

1. This is per host config file , so no global parameters whould be included
2. `hostname` is the top level item in `.yaml` file
3. Each file can contain one or multiple hosts.
4. All valid host level parameters from `upstreams.yaml` are also valid here.
5. In case of conflicting configuration parameters split file wins.
6. If multiple split files contains the same host, the last applied wins.
7. Files are applied in alphabetical order.
8. Split files are read only is there is at least one configured upstream in main `upstreams.yaml` . If `upstreams.yaml` contains no upstreams at all, split files will be ignored.

## Example: Split file

```yaml
some.example.com:
  paths:
    "/":
      rate_limit: 100
      to_https: false
      server_headers:
        - "Y-Proxy-Server-From:Aralez"
      client_headers:
        - "Access-Control-Allow-Origin:*"
        - "Access-Control-Allow-Methods:POST, GET, OPTIONS"
        - "Access-Control-Max-Age:86400"
        - "Strict-Transport-Security:max-age=31536000; includeSubDomains; preload"
      authorization:
        type: "basic"
        data: "admin:admin"
      servers:
        - "127.0.0.1:8000"
        - "127.0.0.2:8000"
other.example.com:
  paths:
    "/":
      redirect_to: "https://some.example.com:6194"
      healthcheck: false
      servers:
        - "127.0.0.3:8000"
```

---

## Example: Kubernetes & Consul Provider

```yaml
provider: "kubernetes" # or "consul"
sticky_sessions: false
to_https: false
rate_limit: 100
server_headers:
  - "X-Forwarded-Proto:https"
  - "X-Forwarded-Port:443"
client_headers:
  - "Access-Control-Allow-Origin:*"
  - "Access-Control-Allow-Methods:POST, GET, OPTIONS"
  - "Access-Control-Max-Age:86400"
consul:
  servers:
    - "http://consul1:8500"
  services:
    - hostname: "nconsul"
      upstream: "nginx-consul-NginX-health"
      path: "/one"
      client_headers:
        - "X-Some-Thing:Yaaaaaaaaaaaaaaa"
        - "X-Proxy-From:Aralez"
      rate_limit: 1
      to_https: false
    - hostname: "nconsul"
      upstream: "nginx-consul-NginX-health"
      path: "/"
  token: "8e2db809-845b-45e1-8b47-2c8356a09da0-a4370955-18c2-4d6e-a8f8-ffcc0b47be81"
kubernetes:
  servers:
    - "172.16.0.11:5443"
  services:
    - hostname: "api-service"
      path: "/"
      upstream: "api-service"
    - hostname: "api-service"
      upstream: "console-service"
      path: "/one"
      client_headers:
        - "X-Some-Thing:Yaaaaaaaaaaaaaaa"
        - "X-Proxy-From:Aralez"
      rate_limit: 100
      to_https: false
    - hostname: "api-service"
      upstream: "feed-service"
      path: "/two"
    - hostname: "websocket-service"
      upstream: "websocket-service"
      path: "/"
  tokenpath: "/opt/Rust/Projects/asyncweb/etc/kubetoken.txt"
```

---

### Mandatory Fields (Consul & Kubernetes)

```yaml
- hostname: "api-service"
  upstream: "api-service"
```

Where `hostname` is the `Host` header to access the service and `upstream` is the service name in Consul or Kubernetes.

### Optional Fields

| Field              | Description                                      |
|--------------------|--------------------------------------------------|
| **path**           | URL path to proxy to upstreams                   |
| **client_headers** | List of additional response headers              |
| **server_headers** | List of additional request headers for upstreams |
| **rate_limit**     | Rate limiter, number of requests per second      |
| **to_https**       | Redirect to HTTPS                                |

### Consul-only

```yaml
token: "8e2db809-..."
```

Consul auth token — mandatory if Consul auth is enabled.

```yaml
servers:
  - "http://consul1:8500"
```

List of Consul servers — **mandatory for Consul**.

### Kubernetes-only

```yaml
tokenpath: "/opt/Rust/Projects/asyncweb/etc/kubetoken.txt"
```

For development only. Defaults to `/var/run/secrets/kubernetes.io/serviceaccount/token`. Remove for production.

```yaml
servers:
  - "172.16.0.11:5443"
```

Defaults to environment variables `KUBERNETES_SERVICE_HOST` and `KUBERNETES_SERVICE_PORT_HTTPS`. For development only — delete for production use.

### Structured logging

**ElasticSearch**

To enable logging to ElasticSearch set `log_structured: elasticsearch` in `main.yaml`. Changes in `main.yaml` requires restart to apply
Configurations parameters for ElasticSearch servers are taken from OS environment.

**These variables must be set.**

- **LOG_ELASTIC_HOSTS** : URLs of Elasticsearch seed hosts, Aralez will take these hosts to construct ES client for all member hosts internally.
- **LOG_ELASTIC_USER** : Username for ElasticSearch authentication.
- **LOG_ELASTIC_PASSWORD** : Password for ElasticSearch authentication.
- **LOG_ELASTIC_INDEX** :  Index to send longs to.
- **LOG_ELASTIC_FLUSH_DURATION** : How long Aralez should keep logs in memory before flushing to ElasticSearch in bulk index api
- **LOG_ELASTIC_BATCH_LEN** : How many messages Aralez should keep logs in memory before flushing to ElasticSearch in bulk index api, in seconds.

The followings defaults fo all parameters:

```bash
LOG_ELASTIC_HOSTS = http://127.0.0.1:9200 
LOG_ELASTIC_USER = elastic
LOG_ELASTIC_PASSWORD = elastic
LOG_ELASTIC_INDEX = aralez-logs
LOG_ELASTIC_FLUSH_DURATION = 2 
LOG_ELASTIC_BATCH_LEN = 200 
```
