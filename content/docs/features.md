# Feature List

Aralez is a Rust-based reverse proxy and load balancer built on
Cloudflare's Pingora framework. It provides runtime-reloadable routing,
automatic protocol handling, service discovery, traffic controls,
caching, and operational APIs.

## 1. Proxying and Protocol Support

- Reverse proxy for HTTP and HTTPS traffic.
- HTTP/2 support with automatic protocol handling.
- gRPC proxying over HTTP/2.
- WebSocket proxying.
- TLS termination for incoming connections.
- TLS connections to upstream servers are detected automatically during health checks.
- Automatic handling of upstream HTTP/2 and gRPC capabilities through health checks.
- Configurable upstream keepalive connection pool size.
- Configurable downstream TCP keepalive parameters.
- Optional TCP Fast Open.
- Support for distributing connections across worker threads.

## 2. Routing and Upstream Management

- Virtual-host routing based on the requested hostname.
- Path-based routing, including deeply nested paths.
- Best-match path selection.
- Multiple backend servers per route.
- A special `DEFAULT` upstream for catch-all routing.
- HTTP-to-HTTPS redirects, configurable globally or per host/path.
- Explicit redirects to another URL through `redirect_to`.
- Global, host-level, and path-level configuration.
- Custom request headers sent to upstream servers.
- Custom response headers sent to clients.
- Global headers, including headers commonly used for CORS.
- Sticky sessions using a cookie with a configurable `Max-Age`.
- File-based upstream configuration.
- Configuration split across multiple YAML files in `conf.d`.
- Split configuration files can define multiple hosts; conflicting host settings are resolved according to file application order, with later files taking precedence.
- Runtime changes to upstream configuration without restarting Aralez.

## 3. Service Discovery and Orchestration

### Consul

- Consul API integration for discovering upstream services.
- Periodic configuration updates from Consul.
- Multiple Consul server endpoints.
- Consul ACL token support.
- Service filtering using the `aralez.service=yes` tag.
- Hostname and path mapping through service tags.
- Nomad integration through Consul service registration.
- Tag-based configuration of request limits, HTTPS redirects, and client/server headers.
- Multiple client and server header tags per service.

### Kubernetes

- Kubernetes API integration for discovering services and upstream endpoints.
- Kubernetes API server configuration.
- Service-account token authentication.
- Configurable token file path for development or custom deployments.
- Hostname, service, and path mappings.
- Per-service request limits, HTTPS redirects, and custom headers.
- Kubernetes service discovery can use the in-cluster API endpoint and  service-account credentials.

## 4. TLS and Certificate Management

- Optional HTTPS listener.
- PEM certificate and private-key support.
- Certificate and key files use matching names with `.crt` and `.key` extensions.
- Certificates are loaded at runtime when new certificate files are added; a restart is not required.
- Configurable TLS security profile:
    - `high`
    - `medium`
    - `unsafe`
- The documented `high` profile is aligned with Qualys SSL Labs A+.
- Built-in Let's Encrypt ACME account creation.
- Automatic certificate ordering.
- Automatic certificate renewal, beginning approximately 30 days before expiry.
- Automatic loading of renewed certificates without restarting Aralez.
- HTTP-01 ACME challenge support.
- DNS-01 ACME challenge support.
- DNS-01 provider integrations documented for:
    - Cloudflare
    - AWS Route 53
    - DigitalOcean
- Extensible DNS-01 provider interface for implementing additional DNS providers.
- ACME account credentials and managed domain lists are stored in the `autoconfigs` directory.

## 5. Authentication and Access Control

Authentication can be configured globally or per path. Global authentication overrides per-path authentication.

Supported methods:

- **HTTP Basic :** Username and password.
- **API Key:** Validates the `x-api-key` request header.
- **JWT:** Accepts a token through the `Authorization: Bearer` header or the `araleztoken` URL parameter.
- **Forward:** Delegates authentication to an external authentication service. (Forward Auth)

Additional authentication capabilities:

- One authentication method can be active at a time for a configuration scope.
- Built-in API endpoint for generating JWT tokens.
- JWT expiration configured in minutes.
- Master-key-based JWT generation and validation.
- Authentication can be applied globally or to individual virtual hosts and paths.

## 6. Rate Limiting and Traffic Controls

- Request rate limiting.
- Separate limits for requests that produce 4xx responses.
- Limits can be configured globally, per host, and per path.
- Limits are calculated per requester IP and virtual host.
- Requests exceeding configured limits receive `429 Too Many Requests`.
- Rate limits can be configured for Consul-discovered services through service tags.
- Health checks can be enabled or disabled per upstream/path.

## 7. Health Checks and Upstream Status

- Active upstream health checks.
- Configurable health-check interval.
- Configurable health-check method:
    - `HEAD`
    - `GET`
    - `POST`
- Health-check status is used to track backend availability.
- Health checks detect upstream TLS, HTTP/2, and gRPC characteristics.
- Health checks can be disabled for individual routes.
- When health checks are disabled, upstream protocol flags such as `is_ssl` and `is_http2` can be configured manually.
- Status API exposes live backend health information and configured upstream details.

## 8. Response Caching

Caching is optional and disabled when the `cache` configuration block is omitted.

Supported storage backends:

- **Memory:** Local in-memory cache.
- **Hybrid:** Memory and local disk tiers; documented as experimental and not recommended for production.
- **Redis:** Supports RESP-compatible systems such as Redis, Valkey, Dragonfly, and KeyDB.
- **TiKV:** Distributed key-value storage using TiKV PD endpoints; the TiKV cluster must have TTL enabled.

Cache controls include:

- Configurable memory capacity.
- Configurable disk capacity for hybrid storage.
- Configurable cache directory for hybrid storage.
- Configurable item size limit.
- Configurable TTL.
- Configurable memory-to-disk flush interval for hybrid storage.
- Upstream `Cache-Control` header support, including `max-age`, `s-maxage`, `no-store`, and `private`.
- Cache eligibility limited to successful 2xx GET responses.
- `Content-Length` is required for a response to be cached.
- Responses exceeding the configured maximum item size are not cached.
- Redis-compatible and TiKV backends allow cache storage to be shared outside a single Aralez process.

## 9. Remote Configuration and Management API

- Built-in HTTP API for pushing a new upstream YAML configuration.
- Configuration updates are applied immediately without restarting Aralez.
- API authentication using the `MASTERKEY` environment variable.
- Master key can be supplied using the `API-KEY` header or the `key` URL query parameter.
- Configuration updates can be temporary or persisted to the local upstream configuration file using the `save` parameter.
- Status endpoint for retrieving live upstream and backend health.
- Status endpoint for retrieving the full configured upstream list and route/backend properties.
- Built-in JWT generation endpoint.
- Built-in ACME account creation and certificate-ordering endpoints.

**Security note:** The configuration API does not provide TLS itself.
Its documentation recommends keeping it bound to localhost and using a
TLS-terminating reverse proxy with authentication for remote access.

## 10. Cluster Mode

- Master/worker deployment model.
- Master node performs health checks and distributes configuration/status updates.
- Worker nodes serve live proxy traffic.
- Worker health checks are disabled; workers receive status from the master.
- Shared `MASTER_KEY` is required on master and worker nodes.
- Master configuration includes worker management endpoints.
- Intended to offload health checks and protocol detection in deployments with large numbers of upstreams.
- The documented implementation supports a single master; RAFT-based master consensus is described as planned, not currently available.

## 11. Static File Serving

- Built-in static file server.
- Configurable local directory to serve.
- Configurable bind address and port.
- Can be used as a standalone endpoint or as an upstream target.

## 12. Logging and Observability

- Configurable global log verbosity:
    - `info`
    - `warn`
    - `error`
    - `debug`
    - `trace`
    - `off`
- Optional access logging.
- Access log modes for all requests or errors only.
- Configurable log output pattern.
- Optional log file output.
- Size-based log rotation.
- Configurable number of rotated files to retain.
- Optional log compression.
- Structured logging output for Elasticsearch.
- Prometheus metrics endpoint.
- Status API for inspecting configured upstreams and live backend health.

## 13. Process and Runtime Operations

- Configurable number of proxy worker threads.
- Optional privilege dropping using a configured user and group.
- PID file support.
- Upgrade socket for zero-downtime binary upgrades and state handoffs.
- Configurable upstream keepalive pool size.
- Configurable TCP keepalive idle time, probe interval, and probe
  count.
- Optional `SO_REUSEPORT`.
- Configurable TCP Fast Open backlog.

## 14. Configuration and Deployment

- YAML-based startup configuration (`main.yaml`).
- YAML-based upstream configuration (`upstreams.yaml`).
- File and service-discovery-based upstream providers.
- Multiple upstream configuration files through `conf.d`.
- Environment-variable configuration for secrets and integrations,
  including ACME DNS credentials and master keys.
- Designed to run standalone or as part of Nomad/Consul and Kubernetes
  deployments.
- Can be deployed as a self-contained proxy binary without requiring
  plugins or sidecars for the documented built-in features.

## Feature Summary

| Area                 | Capabilities                                                                          |
|:---------------------|:--------------------------------------------------------------------------------------|
| **Proxy protocols**  | HTTP, HTTPS, HTTP/2, gRPC,WebSocket                                                   |
| **Routing**          | Virtual hosts, path matching, catch-all routing, redirects                            |
| **Upstreams**        | Multiple backends, keepalive pooling, sticky sessions                                 |
| **Discovery**        | Consul, Kubernetes, Nomad via Consul                                                  |
| **TLS**              | TLS termination, TLS profiles, hot certificate loading                                |
| **ACME**             | Let's Encrypt, HTTP-01, DNS-01, automatic renewal                                     |
| **Authentication**   | Basic, API key, JWT, Forward Auth                                                     |
| **Traffic controls** | Rate limits, 4xx limits                                                               |
| **Health**           | Active checks, backend status, protocol detection                                     |
| **Cache**            | Memory, hybrid, Redis-compatible, TiKV                                                |
| **Configuration**    | YAML files, split configuration, remote push API, hot updates                         |
| **Clustering**       | Master/worker configuration and status distribution                                   |
| **Static content**   | Built-in static file server                                                           |
| **Observability**    | Prometheus, access logs, structured Elasticsearch and OpenTelemetery logs, status API |
| **Operations**       | Privilege drop, PID file, upgrade socket, TCP tuning                                  |

## Notes on Scope

- This list consolidates the supplied documentation files: API, authentication, automatic TLS, cache, feature comparison, configuration, and Consul integration.
- The documentation index file contains site metadata rather than additional feature descriptions.
- The comparison table describes some features as built-in or automatic; detailed descriptions above follow the specific feature and configuration documentation where available.
- Hybrid cache is explicitly marked experimental and not recommended for production in the cache documentation.
- RAFT-based master consensus is listed as planned in the cluster documentation, not as an implemented feature.
