---
title: "Feature Comparison"
description: "How Aralez compares to Nginx, HAProxy, Traefik, Caddy and Envoy"
weight: 5
---

### Feature Comparison

| Feature / Proxy    | **Aralez** |  **Nginx**  | **HAProxy** | **Traefik** | **Caddy**  | **Envoy** |
|--------------------|:----------:|:-----------:|:-----------:|:-----------:|:----------:|:---------:|
| **Reload**         |   ✅ Hot    |  ⚙️ Manual  |  ⚙️ Manual  |    ✅ Hot    |   ✅ Hot    |   ✅ Hot   |
| **Cert load**      |   ✅ Hot    |  ❌ Reload   |  ❌ Reload   |    ✅ Yes    |   ✅ Yes    |  ⚙️ No ?  |
| **Authentication** |   ✅ Yes    | ⚙️ Limited  | ⚙️ Limited  |    ✅ Yes    |   ✅ Yes    |   ✅ Yes   |
| **HTTP2**          |   ✅ Yes    |  ⚙️ Manual  |  ⚙️ Manual  |    ✅ Yes    |   ✅ Yes    |   ✅ Yes   |
| **TLS Grades**     |   ✅ Yes    |  ⚙️ Manual  |  ⚙️ Manual  |  ⚙️ Manual  |   ✅ Yes    | ⚙️ Manual |
| **gRPC**           |   ✅ Auto   |  ⚙️ Manual  |  ⚙️ Manual  |  ⚙️ Manual  | ⚙️ Manual  | ⚙️ Manual |
| **SSL Proxy**      |   ✅ Auto   |  ⚙️ Manual  |  ⚙️ Manual  |    ✅ Yes    |   ✅ Yes    |   ✅ Yes   |
| **HTTP/2**         |   ✅ Auto   |  ⚙️ Manual  |  ⚙️ Manual  |    ✅ Yes    |   ✅ Yes    |   ✅ Yes   |
| **WebSocket**      |   ✅ Auto   |  ⚙️ Manual  |  ⚙️ Manual  |    ✅ Yes    |   ✅ Yes    |   ✅ Yes   |
| **Sticky Session** |   ✅ Yes    |    ❌ No     |   ⚙️ Yes    |    ✅ Yes    | ⚙️ Limited | ✅ Manual  |
| **Prometheus**     |   ✅ Yes    | ⚙️ External |    ✅ Yes    |    ✅ Yes    |   ✅ Yes    |   ✅ Yes   |
| **Consul**         |   ✅ Yes    |    ❌ No     |  ⚙️DNS API  |    ✅ Yes    |    ❌ No    |   ✅ Yes   |
| **Kubernetes**     |   ✅ Yes    | ⚙️ Ingress  | ⚙️ External |    ✅ Yes    | ⚙️ Limited |   ✅ Yes   |
| **Limiter**        |   ✅ Yes    |    ✅ Yes    |    ✅ Yes    |    ✅ Yes    |   ✅ Yes    |   ✅ Yes   |
| **Static Files**   |   ✅ Yes    |    ✅ Yes    |  ⚙️ Lua ?   |    ✅ Yes    |   ✅ Yes    |   ❌ No    |
| **Health Checks**  |   ✅ Yes    |  ⚙️ Manual  |  ⚙️ Manual  |    ✅ Yes    |   ✅ Yes    |   ✅ Yes   |
| **Built With**     |    Rust    |      C      |      C      |     Go      |     Go     |    C++    |

---

✅ **Auto** – Automatically detected and loaded  
✅ **Hot** – Works immediately, no reload/restart is required  
✅ **Yes** – Works immediately, no setup required  
⚙️ **Manual** – Requires explicit configuration or modules  
⚙️ **Reload** – Reload or restart is required  
⚙️ **Limited** – Support is limited to certain features  
⚙️ **External** – Requires an external module  
❌ **No** – Not supported

### Interpretation

Aralez aims to combine the **simplicity of NGINX**, the **observability of Envoy**, and the **dynamic features of Traefik**, all in a modern, lightweight Rust codebase.

Where most proxies require external tooling or complex configuration for dynamic updates, Aralez focuses on **automatic behavior by default**:

- Upstreams and certificates **reload instantly** with zero downtime.
- **Health checks, TLS termination, and protocol upgrades** happen automatically.
- **Authentication and metrics** are built-in, not bolted on.
- **Consul and Kubernetes integration** make it mesh-ready without extra agents.
- Written in **safe, high-performance Rust**, offering reliability and modern concurrency.

In short, Aralez is designed for developers and operators who want **a fast, self-contained reverse proxy** that "just works," while still being flexible enough to scale into a service-mesh-like architecture.

### Zero-Config Features

Aralez is designed to **just work out of the box**, minimizing setup and manual configuration. With Aralez, you get:

- **Automatic protocol detection:** gRPC, HTTP/2, WebSockets, and SSL are proxied correctly without extra config.
- **Hot reloads & zero downtime:** Upstreams and configuration changes take effect immediately without restarting the server.
- **Automatic TLS / certificate updates:** Drop new certificates on disk and Aralez picks them up instantly.
- **Built-in authentication & rate limiting:** Basic auth, API key, JWT, and request limits are ready-to-use.
- **Observability & metrics:** Prometheus metrics are available automatically.
- **Service discovery integration:** Works seamlessly with Consul and Kubernetes DNS without extra setup.
