![Aralez](https://netangels.net/utils/aralez-white.jpg)

---

## Aralez (Արալեզ),Reverse proxy built on top of Cloudflare's Pingora

Aralez is a high-performance Rust reverse proxy with zero-configuration automatic HTTP, HTTPS, gRPC, WebSockets protocol handling, TLS, and upstream management,
featuring Consul and Kubernetes integration for dynamic pod discovery and health-checked routing, acting as a lightweight ingress-style proxy.

---

What Aralez means ?
**Aralez = Արալեզ** <ins>.Named after the legendary Armenian guardian spirit, winged dog-like creature, that descend upon fallen heroes to lick their wounds and resurrect them.</ins>.

Built on Rust, on top of **Cloudflare’s Pingora engine**, **Aralez** delivers world-class performance, security and scalability — right out of the box.

**Support my OpenSource initiative :** [![Buy Me A Coffee](https://img.shields.io/badge/☕-Buy%20me%20a%20coffee-orange)](https://www.buymeacoffee.com/sadoyan)

---

## 🔧 Key Features

- **Dynamic Config Reloads** — Upstreams can be updated live via API, no restart required.
- **TLS Termination** — Built-in OpenSSL support.
    - **Automatic load of certificates** — Automatically reads and loads certificates from a folder, without a restart.
- **Upstreams TLS detection** — Aralez will automatically detect if upstreams uses secure connection.
- **Built in rate limiter** — Limit requests to server, by setting up upper limit for requests per seconds, per virtualhost.
    - **Global rate limiter** — Set rate limit for all virtualhosts.
    - **Per path rate limiter** — Set rate limit for specific paths. Path limits will override global limits.
- **Authentication** — Supports Basic Auth, API tokens, and JWT verification.
    - **Basic Auth**
    - **API Key** via `x-api-key` header
    - **JWT Auth**, with tokens issued by Aralez itself via `/jwt` API
        - ⬇️ See below for examples and implementation details.
- **Load Balancing Strategies**
    - Round-robin
    - Failover with health checks
    - Sticky sessions via cookies
- **Unified Port** — Serve HTTP and WebSocket traffic over the same connection.
- **Built in file server** — Build in minimalistic file server for serving static files, should be added as upstreams for public access.
- **Memory Safe** — Created purely on Rust.
- **High Performance** — Built with [Pingora](https://github.com/cloudflare/pingora) and tokio for async I/O.

## 🌍 Highlights

- ⚙️ **Upstream Providers:**
    - `file` Upstreams are declared in config file.
    - `consul` Upstreams are dynamically updated from Hashicorp Consul.
- 🔁 **Hot Reloading:** Modify upstreams on the fly via `upstreams.yaml` — no restart needed.
- 🔮 **Automatic WebSocket Support:** Zero config — connection upgrades are handled seamlessly.
- 🔮 **Automatic GRPC Support:** Zero config, Requires `ssl` to proxy, gRPC handled seamlessly.
- 🔮 **Upstreams Session Stickiness:** Enable/Disable Sticky sessions globally.
- 🔐 **TLS Termination:** Fully supports TLS for upstreams and downstreams.
- 🛡️ **Built-in Authentication** Basic Auth, JWT, API key.
- 🧠 **Header Injection:** Global and per-route header configuration.
- 🧪 **Health Checks:** Pluggable health check methods for upstreams.
- 🛰️ **Remote Config Push:** Lightweight HTTP API to update configs from CI/CD or other systems.

---

## 📁 File Structure

```
.
├── main.yaml           # Main configuration loaded at startup
├── upstreams.yaml      # Watched config with upstream mappings
├── etc/
│   ├── server.crt      # TLS certificate (required if using TLS)
│   └── key.pem         # TLS private key
```

---

## 🛠 Configuration Overview

### 🔧 `main.yaml`
Contains  basic startup parameters, loaded on startup.  
### 🌐 `upstreams.yaml`

- `provider`: `file` or `consul`
- File-based upstreams define:
    - Hostnames and routing paths
    - Backend servers (load-balanced)
    - Optional request headers, specific to this upstream
- Global headers (e.g., CORS) apply to all proxied responses
- Optional authentication (Basic, API Key, JWT)

---

## 🔄 Hot Reload

- Changes to `upstreams.yaml` are applied immediately.
- No need to restart the proxy — just save the file.
- If `consul` provider is chosen, upstreams will be periodically update from Consul's API.

---

## 🔐 TLS Support

To enable TLS for A proxy server: Currently only OpenSSL is supported, working on Boringssl and Rustls

1. Set `proxy_address_tls` in `main.yaml`
2. Provide `tls_certificate` and `tls_key_file`

---

## 📡 Remote Config API

Push new `upstreams.yaml` over HTTP to `config_address` (`:3000` by default). Useful for CI/CD automation or remote config updates.
URL parameter. `key=MASTERKEY` is required. `MASTERKEY` is the value of `master_key` in the `main.yaml`

```bash
curl -XPOST --data-binary @./etc/upstreams.txt 127.0.0.1:3000/conf?key=${MASTERKEY}
```

---

## 📃 License

[Apache License Version 2.0](https://www.apache.org/licenses/LICENSE-2.0)

---

## 🧠 Notes

- Uses Pingora under the hood for efficiency and flexibility.
- Designed for edge proxying, internal routing, or hybrid cloud scenarios.
- Transparent, fully automatic WebSocket upgrade support.
- Transparent, fully automatic gRPC proxy.
- Sticky session support.
- HTTP2 ready.

