---
title: "Feature Comparison"
description: "How Aralez compares to Nginx, HAProxy, Traefik, Caddy and Envoy"
weight: 5
---

### Feature Comparison

| Feature / Proxy             | **Aralez** |  **Nginx**  | **HAProxy** | **Traefik** |  **Caddy**  |  **Envoy**  |
|-----------------------------|:----------:|:-----------:|:-----------:|:-----------:|:-----------:|:-----------:|
| **Reload**                  |   ✅ Hot    |  ⚙️ Manual  |  ⚙️ Manual  |    ✅ Hot    |    ✅ Hot    |    ✅ Hot    |
| **Cert load**               |   ✅ Hot    |  ⚙️ Reload  |  ⚙️ Reload  |    ✅ Yes    |    ✅ Yes    |  ⚙️ Manual  |
| **Auto TLS (ACME + DNS)**   | ✅ Built-in | ⚙️ External | ⚙️ Partial  |    ✅ Yes    |    ✅ Yes    |    ❌ No     |
| **Authentication**          |   ✅ Yes    | ⚙️ Limited  | ⚙️ Limited  |    ✅ Yes    |    ✅ Yes    |    ✅ Yes    |
| **HTTP/2**                  |   ✅ Auto   |  ⚙️ Manual  |  ⚙️ Manual  |    ✅ Yes    |    ✅ Yes    |    ✅ Yes    |
| **TLS Grades**              |   ✅ Yes    |  ⚙️ Manual  |  ⚙️ Manual  |  ⚙️ Manual  |    ✅ Yes    |  ⚙️ Manual  |
| **gRPC**                    |   ✅ Auto   |  ⚙️ Manual  |  ⚙️ Manual  |  ⚙️ Manual  |  ⚙️ Manual  |  ⚙️ Manual  |
| **SSL Proxy**               |   ✅ Auto   |  ⚙️ Manual  |  ⚙️ Manual  |    ✅ Yes    |    ✅ Yes    |    ✅ Yes    |
| **WebSocket**               |   ✅ Auto   |  ⚙️ Manual  |  ⚙️ Manual  |    ✅ Yes    |    ✅ Yes    |    ✅ Yes    |
| **Sticky Session**          |   ✅ Yes    |    ❌ No     |    ✅ Yes    |    ✅ Yes    | ⚙️ Limited  |  ⚙️ Manual  |
| **Response Cache**          | ✅ Built-in |    ✅ Yes    | ⚙️ Limited  | ⚙️ Plugin¹  |  ⚙️ Plugin  |  ⚙️ Manual  |
| **Redis / Valkey Cache**    | ✅ Built-in |  ⚙️ Plugin  |    ❌ No     |    ❌ No     |  ⚙️ Plugin  |    ❌ No     |
| **Remote Config**           | ✅ Push API | ⚙️ External | ⚙️ External | ⚙️ Limited  |    ✅ Yes    | ⚙️ External |
| **Cluster (master/worker)** | ✅ Built-in | ⚙️ External | ⚙️ External | ⚙️ External | ⚙️ External | ⚙️ External |
| **Prometheus**              |   ✅ Yes    | ⚙️ External |    ✅ Yes    |    ✅ Yes    |    ✅ Yes    |    ✅ Yes    |
| **Consul**                  |   ✅ Yes    |    ❌ No     | ⚙️ Limited  |    ✅ Yes    |    ❌ No     |    ✅ Yes    |
| **Kubernetes**              |   ✅ Yes    | ⚙️ External | ⚙️ External |    ✅ Yes    | ⚙️ Limited  |    ✅ Yes    |
| **Limiter**                 |   ✅ Yes    |    ✅ Yes    |    ✅ Yes    |    ✅ Yes    |    ✅ Yes    |    ✅ Yes    |
| **Static Files**            |   ✅ Yes    |    ✅ Yes    |  ⚙️ Manual  |    ✅ Yes    |    ✅ Yes    |    ❌ No     |
| **Health Checks**           |   ✅ Yes    |  ⚙️ Manual  |  ⚙️ Manual  |    ✅ Yes    |    ✅ Yes    |    ✅ Yes    |
| **Structured Logs (ELK)**   | ✅ Built-in |  ⚙️ Manual  |  ⚙️ Manual  |    ✅ Yes    |    ✅ Yes    |    ✅ Yes    |
| **Log Rotation**            | ✅ Built-in | ⚙️ External | ⚙️ External |  ⚙️ Manual  |    ✅ Yes    |  ⚙️ Manual  |
| **Privilege Drop**          |   ✅ Yes    |    ✅ Yes    |    ✅ Yes    |    ❌ No     |    ❌ No     |    ❌ No     |
| **Memory Safe**             |   ✅ Yes    |    ❌ No     |    ❌ No     |    ✅ Yes    |    ✅ Yes    |    ❌ No     |
| **Built With**              |    Rust    |      C      |      C      |     Go      |     Go      |     C++     |

<sub>¹ Traefik response caching is available only as a plugin or in the enterprise edition.</sub>

✅ **Auto** – Automatically detected and configured, no setup needed  
✅ **Hot** – Applied immediately, no reload or restart required  
✅ **Yes** – Supported natively, works out of the box  
✅ **Built-in** – Included in the core binary, no plugins or external tools  
✅ **Push API** – Config can be pushed remotely over a built-in HTTP API  
⚙️ **Manual** – Requires explicit configuration or extra modules  
⚙️ **Reload** – Reload or restart is required to apply  
⚙️ **Limited** – Support covers only certain features  
⚙️ **Partial** – Available, but incomplete or only in recent versions  
⚙️ **Plugin** – Requires a third-party plugin or module  
⚙️ **External** – Requires an external tool, service or control plane  
❌ **No** – Not supported

### Overview

Aralez is a reverse proxy written in Rust on top of Cloudflare's Pingora framework. It is built around runtime-reloadable configuration and protocol handling that works without per-route setup.

- **Hot reload:** upstream definitions and TLS certificates are applied at runtime without restarting the process or dropping connections.
- **Protocol handling:** HTTP/2, gRPC, WebSocket and TLS termination are detected and proxied without extra configuration.
- **Built-in features:** authentication, rate limiting, health checks, Prometheus metrics, response caching and a static file server are part of the binary. No plugins or sidecars are needed.
- **Service discovery:** Consul and Kubernetes are supported as upstream sources.
- **Memory safety:** Rust removes the common memory-safety bug classes found in C and C++ proxies, and async I/O handles concurrency.

### Default Behavior

With a minimal `main.yaml` and an upstreams file, the following works without further setup:

- **Protocol detection:** gRPC, HTTP/2, WebSocket and TLS traffic is proxied correctly without per-route flags.
- **Hot reload:** changes to the upstreams file, or pushed through the config API, apply without a restart.
- **Certificates:** certificates and keys placed in `proxy_configs` (named `{NAME}.crt` and `{NAME}.key`) are loaded at runtime. ACME certificate issuance with DNS-01 challenge is supported, with the provider set by `acme_dns_provider`.
- **TLS profiles:** `proxy_tls_grade` selects a cipher suite profile (`high`, `medium`, `unsafe`) aligned with Qualys SSL Labs grades.
- **Authentication and rate limiting:** Basic auth, API key, JWT, Forward Auth and request limits are configured per upstream or globally.
- **Health checks:** active checks run at a set interval (`hc_interval`) using HEAD, GET or POST (`hc_method`).
- **Metrics:** Prometheus metrics are exposed by default.
- **Service discovery:** Consul and Kubernetes upstreams are supported.
- **Connection pooling:** upstream keepalive pool size is configurable.

### Optional Features

These are disabled until configured:

- **Response cache:** in-memory or Redis-compatible (Redis, Valkey, Dragonfly), with configurable size, default TTL and maximum item size. It uses upstream cache-control headers when they are present.
- **Remote config API:** upstreams can be pushed over HTTP (`config_api_enabled`, `config_address`).
- **Cluster mode:** master and worker nodes (`cluster_member`, `worker_nodes`) for distributing configuration.
- **Static file server:** serves a local directory on its own address and can be used as an upstream.
- **Logging:** access log filtering (`all` or `error`), a custom log pattern, file output with size-based rotation and compression, and structured output for Elasticsearch.
- **Process options:** privilege drop (`runuser`, `rungroup`), PID file, an upgrade socket, and TCP keepalive tuning for downstream connections.

### Intended Use

Aralez targets setups that need a self-contained reverse proxy or ingress with dynamic upstreams and little configuration. It can also run as a clustered deployment with Consul or Kubernetes service discovery.