## 🛠 Configuration Overview

### 🔧 `main.yaml`

| Key                              | Example Value                        | Description                                                                                        |
|----------------------------------|--------------------------------------|----------------------------------------------------------------------------------------------------|
| **threads**                      | 12                                   | Number of running daemon threads. Optional, defaults to 1                                          |
| **runuser**                      | aralez                               | Optional, Username for running aralez after dropping root privileges, requires to launch as root   |
| **rungroup**                     | aralez                               | Optional,Group for running aralez after dropping root privileges, requires to launch as root       |
| **daemon**                       | false                                | Run in background (boolean)                                                                        |
| **upstream_keepalive_pool_size** | 500                                  | Pool size for upstream keepalive connections                                                       |
| **pid_file**                     | /tmp/aralez.pid                      | Path to PID file                                                                                   |
| **error_log**                    | /tmp/aralez_err.log                  | Path to error log file                                                                             |
| **upgrade_sock**                 | /tmp/aralez.sock                     | Path to live upgrade socket file                                                                   |
| **config_address**               | 0.0.0.0:3000                         | HTTP API address for pushing upstreams.yaml from remote location                                   |
| **config_tls_address**           | 0.0.0.0:3001                         | HTTPS API address for pushing upstreams.yaml from remote location                                  |
| **config_tls_certificate**       | etc/server.crt                       | Certificate file path for API. Mandatory if proxy_address_tls is set, else optional                |
| **proxy_tls_grade**              | (high, medium, unsafe)               | Grade of TLS ciphers, for easy configuration. High matches Qualys SSL Labs A+ (defaults to medium) |
| **config_tls_key_file**          | etc/key.pem                          | Private Key file path. Mandatory if proxy_address_tls is set, else optional                        |
| **proxy_address_http**           | 0.0.0.0:6193                         | Aralez HTTP bind address                                                                           |
| **proxy_address_tls**            | 0.0.0.0:6194                         | Aralez HTTPS bind address (Optional)                                                               |
| **proxy_certificates**           | etc/certs/                           | The directory containing certificate and key files. In a format {NAME}.crt, {NAME}.key.            |
| **upstreams_conf**               | etc/upstreams.yaml                   | The location of upstreams file                                                                     |
| **log_level**                    | info                                 | Log level , possible values : info, warn, error, debug, trace, off                                 |
| **hc_method**                    | HEAD                                 | Healthcheck method (HEAD, GET, POST are supported) UPPERCASE                                       |
| **hc_interval**                  | 2                                    | Interval for health checks in seconds                                                              |
| **master_key**                   | 5aeff7f9-7b94-447c-af60-e8c488544a3e | Master key for working with API server and JWT Secret generation                                   |
| **file_server_folder**           | /some/local/folder                   | Optional, local folder to serve                                                                    |
| **file_server_address**          | 127.0.0.1:3002                       | Optional, Local address for file server. Can set as upstream for public access                     |
| **config_api_enabled**           | true                                 | Boolean to enable/disable remote config push capability                                            |

### 🌐 `upstreams.yaml`

- `provider`: `file` or `consul`
- File-based upstreams define:
    - Hostnames and routing paths
    - Backend servers (load-balanced)
    - Optional request headers, specific to this upstream
- Global headers (e.g., CORS) apply to all proxied responses
- Optional authentication (Basic, API Key, JWT)

---

## 💡 Example

A sample `upstreams.yaml` entry:

```yaml
provider: "file"
sticky_sessions: false
to_https: false
rate_limit: 10
headers:
  - "Access-Control-Allow-Origin:*"
  - "Access-Control-Allow-Methods:POST, GET, OPTIONS"
  - "Access-Control-Max-Age:86400"
authorization:
  type: "jwt"
  creds: "910517d9-f9a1-48de-8826-dbadacbd84af-cb6f830e-ab16-47ec-9d8f-0090de732774"
myhost.mydomain.com:
  paths:
    "/":
      rate_limit: 20
      to_https: false
      headers:
        - "X-Some-Thing:Yaaaaaaaaaaaaaaa"
        - "X-Proxy-From:Hopaaaaaaaaaaaar"
      servers:
        - "127.0.0.1:8000"
        - "127.0.0.2:8000"
    "/foo":
      to_https: true
      headers:
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

- Sticky sessions are disabled globally. This setting applies to all upstreams. If enabled all requests will be 301 redirected to HTTPS.
- HTTP to HTTPS redirect disabled globally, but can be overridden by `to_https` setting per upstream.
- Requests to each hosted domains will be limited to 10 requests per second per virtualhost.
    - Requests limits are calculated per requester ip plus requested virtualhost.
    - If the requester exceeds the limit it will receive `429 Too Many Requests` error.
    - Optional. Rate limiter will be disabled if the parameter is entirely removed from config.
- Requests to `myhost.mydomain.com/` will be limited to 20 requests per second.
- Requests to `myhost.mydomain.com/` will be proxied to `127.0.0.1` and `127.0.0.2`.
- Plain HTTP to `myhost.mydomain.com/foo` will get 301 redirect to configured TLS port of Aralez.
- Requests to `myhost.mydomain.com/foo` will be proxied to `127.0.0.4` and `127.0.0.5`.
- Requests to `myhost.mydomain.com/.well-known/acme-challenge` will be proxied to `127.0.0.1:8001`, but healthcheks are disabled.
- SSL/TLS for upstreams is detected automatically, no need to set any config parameter.
    - Assuming the `127.0.0.5:8443` is SSL protected. The inner traffic will use TLS.
    - Self-signed certificates are silently accepted.
- Global headers (CORS for this case) will be injected to all upstreams.
- Additional headers will be injected into the request for `myhost.mydomain.com`.
- You can choose any path, deep nested paths are supported, the best match chosen.
- All requests to servers will require JWT token authentication (You can comment out the authorization to disable it),
    - Firs parameter specifies the mechanism of authorisation `jwt`
    - Second is the secret key for validating `jwt` tokens

## 💡 For Kubernetes and Consul provider
```yaml
provider: "kubernetes" # "consul" "kubernetes"
sticky_sessions: false
to_https: false
rate_limit: 100
headers:
  - "Access-Control-Allow-Origin:*"
  - "Access-Control-Allow-Methods:POST, GET, OPTIONS"
  - "Access-Control-Max-Age:86400"
  - "Strict-Transport-Security:max-age=31536000; includeSubDomains; preload"
consul:
  servers:
    - "http://consul1:8500"
  services: # hostname: The hostname to access the proxy server, upstream : The real service name in Consul database.
    - hostname: "nconsul"
      upstream: "nginx-consul-NginX-health"
      path: "/one"
      headers:
        - "X-Some-Thing:Yaaaaaaaaaaaaaaa"
        - "X-Proxy-From:Aralez"
      rate_limit: 1
      to_https: false
    - hostname: "nconsul"
      upstream: "nginx-consul-NginX-health"
      path: "/"
  token: "8e2db809-845b-45e1-8b47-2c8356a09da0-a4370955-18c2-4d6e-a8f8-ffcc0b47be81" # Consul server access token, If Consul auth is enabled
kubernetes:
  servers:
    - "172.16.0.11:5443" # Gets KUBERNETES_SERVICE_HOST : KUBERNETES_SERVICE_PORT_HTTPS env variables.
  services:
    - hostname: "vt-api-service-v2"
      path: "/"
      upstream: "vt-api-service-v2"
    - hostname: "vt-api-service-v2"
      upstream: "vt-console-service"
      path: "/one"
      headers:
        - "X-Some-Thing:Yaaaaaaaaaaaaaaa"
        - "X-Proxy-From:Aralez"
      rate_limit: 100
      to_https: false
    - hostname: "vt-api-service-v2"
      upstream: "vt-feed-fanout-service"
      path: "/two"
    - hostname: "vt-websocket-service"
      upstream: "vt-websocket-service"
      path: "/"
  tokenpath: "/opt/Rust/Projects/asyncweb/etc/kubetoken.txt" # Defaults to /var/run/secrets/kubernetes.io/serviceaccount/token
```

The yaml structure of Consul and Kubernetes providers is different. Each section contains mandatory and optional fields. 

### **Mandatory Fields:** 
```yaml
    - hostname: "vt-api-service-v2"
      upstream: "vt-api-service-v2"
```
Where `hostname` is actually the `Host` header to access the service and `upstream` is a service name in Consul or Kubernetes. 

### **Optional Fields:** 
```yaml
      path: "/one"
      headers:
        - "X-Some-Thing:Yaaaaaaaaaaaaaaa"
        - "X-Proxy-From:Aralez"
      rate_limit: 100
      to_https: false
```
Optional parameters defaults to `None`, if not set 


|                 |                                 |
|-----------------|---------------------------------|
| **path:**       | Url path to proxy to upstreams  |
| **headers:**    | List of additional headers      |
| **rate_limit:** | Rate limiter, number per second |
| **to_https:**   | Redirect to HTTPS               |

### **Consul only** 
```yaml
token: "8e2db809-845b-45e1-8b47-2c8356a09da0-a4370955-18c2-4d6e-a8f8-ffcc0b47be81"
```
If authentication is enabled this parameter should contain. Default `None`, mandatory if Consul auth is enabled  

```yaml
  servers:
    - "http://consul1:8500"
```
The list of Consul servers. **Mandatory for Consul**

### **Kubernetes only** 
```yaml
tokenpath: "/opt/Rust/Projects/asyncweb/etc/kubetoken.txt
```
For development propose only. Default to `/var/run/secrets/kubernetes.io/serviceaccount/token`. Remove iot for production use.

```yaml
  servers:
    - "172.16.0.11:5443"
```

Defaults to the following environment variables.
```
KUBERNETES_SERVICE_HOST
KUBERNETES_SERVICE_PORT_HTTPS 
```
For development propose only. Delete for production use.