---
title: "Configuration"
description: "Reference for main.yaml and upstreams.yaml"
weight: 2
---

## `main.yaml` — Startup Parameters

| Key | Example Value | Description |
|---|---|---|
| **threads** | 12 | Number of running daemon threads. Optional, defaults to 1 |
| **runuser** | aralez | Optional. Username for running aralez after dropping root privileges (requires launch as root) |
| **rungroup** | aralez | Optional. Group for running aralez after dropping root privileges (requires launch as root) |
| **daemon** | false | Run in background (boolean) |
| **upstream_keepalive_pool_size** | 500 | Pool size for upstream keepalive connections |
| **pid_file** | /tmp/aralez.pid | Path to PID file |
| **error_log** | /tmp/aralez_err.log | Path to error log file |
| **config_address** | 0.0.0.0:3000 | HTTP API address for pushing upstreams.yaml from remote location |
| **config_tls_address** | 0.0.0.0:3001 | HTTPS API address for pushing upstreams.yaml from remote location |
| **config_tls_certificate** | etc/server.crt | Certificate file path for API |
| **proxy_tls_grade** | high, medium, unsafe | Grade of TLS ciphers. `high` matches Qualys SSL Labs A+ (defaults to `medium`) |
| **config_tls_key_file** | etc/key.pem | Private Key file path |
| **proxy_address_http** | 0.0.0.0:6193 | Aralez HTTP bind address |
| **proxy_address_tls** | 0.0.0.0:6194 | Aralez HTTPS bind address (Optional) |
| **proxy_certificates** | etc/certs/ | Directory containing `{NAME}.crt` and `{NAME}.key` files |
| **upstreams_conf** | etc/upstreams.yaml | Location of the upstreams file |
| **log_level** | info | Log level: `info`, `warn`, `error`, `debug`, `trace`, `off` |
| **hc_method** | HEAD | Healthcheck method: HEAD, GET, POST (UPPERCASE) |
| **hc_interval** | 2 | Interval for health checks in seconds |
| **master_key** | 5aeff7f9-... | Master key for API server and JWT Secret generation |
| **file_server_folder** | /some/local/folder | Optional. Local folder to serve |
| **file_server_address** | 127.0.0.1:3002 | Optional. Local address for file server |
| **config_api_enabled** | true | Enable/disable remote config push capability |

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
sticky_sessions: false
to_https: false
rate_limit: 10
server_headers:
  - "X-Forwarded-Proto:https"
  - "X-Forwarded-Port:443"
client_headers:
  - "Access-Control-Allow-Origin:*"
  - "Access-Control-Allow-Methods:POST, GET, OPTIONS"
  - "Access-Control-Max-Age:86400"
authorization:
  type: "jwt"
  creds: "910517d9-f9a1-48de-8826-dbadacbd84af-cb6f830e-ab16-47ec-9d8f-0090de732774"
redir.mydomain.com:
  paths:
    "/":
      redirect_to: "https://myhost.mydomain.com:6194"
      servers:
        - "127.0.0.1:8000"
        - "127.0.0.2:8000"
myhost.mydomain.com:
  paths:
    "/":
      rate_limit: 20
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
      client_headers:
        - "X-Another-Header:Hohohohoho"
      servers:
        - "127.0.0.4:8443"
        - "127.0.0.5:8443"
    "/.well-known/acme-challenge":
      healthcheck: false
      servers:
        - "127.0.0.1:8001"
```

**This means:**

- Sticky sessions are disabled globally.
- HTTP to HTTPS redirect is disabled globally, but can be overridden per upstream with `to_https`.
- All upstreams receive custom headers: `X-Forwarded-Proto:https` and `X-Forwarded-Port:443`.
- Requests to each hosted domain are limited to 10 requests/second per virtualhost (per requester IP + virtualhost). Exceeding returns `429 Too Many Requests`.
- Requests to `myhost.mydomain.com/` are limited to 20 req/sec and proxied to `127.0.0.1` and `127.0.0.2`.
- Plain HTTP to `myhost.mydomain.com/foo` gets a 301 redirect to the configured TLS port.
- Requests to `myhost.mydomain.com/foo` are proxied to `127.0.0.4` and `127.0.0.5`.
- Requests to `redir.mydomain.com/ANY/PATH` are 301 redirected  to `myhost.mydomain.com/ANY/PATH`.  
- SSL/TLS for upstreams is detected automatically. Self-signed certificates are silently accepted.
- Global CORS headers are injected to all upstreams.
- All requests require JWT token authentication.

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

| Field | Description |
|---|---|
| **path** | URL path to proxy to upstreams |
| **client_headers** | List of additional response headers |
| **server_headers** | List of additional request headers for upstreams |
| **rate_limit** | Rate limiter, number of requests per second |
| **to_https** | Redirect to HTTPS |

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
