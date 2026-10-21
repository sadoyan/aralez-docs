---
title: "API"
description: "Remote Config API and Status API reference"
weight: 3
---

## Remote Configuration API

Aralez provides an HTTP API for updating the upstream configuration by pushing a new upstreams.yaml file to config_address, which defaults to `127.0.0.1:3000`.
This API is useful for automating configuration updates in CI/CD pipelines or managing upstreams remotely.

**Authentication**

The configuration API requires authentication using the `MASTERKEY` environment variable.
Before enabling the API, make sure the `MASTERKEY` environment variable is set in the Aralez process environment.`

Each request must provide the master key using one of the following methods:
- The API-KEY HTTP header.
- The key URL query parameter.

Updating the configuration

To push a new configuration, send a POST request containing the YAML file.

Example using the API-KEY header:
```shell
curl -X POST \
  -H "API-KEY: $MASTERKEY" \
  --data-binary @/tmp/alter.yaml \
  http://127.0.0.1:3000/conf
```

Alternatively, pass the key as a query parameter:
```shell
curl -X POST \
  --data-binary @/tmp/alter.yaml \
  "http://127.0.0.1:3000/conf?key=$MASTERKEY"
```
By default, the updated configuration is temporary and will be lost when Aralez restarts.

To persist the changes, append the save query parameter to the endpoint.

Example using the API-KEY header:
```shell
curl -X POST \
  -H "API-KEY: $MASTERKEY" \
  --data-binary @/tmp/alter.yaml \
  "http://127.0.0.1:3000/conf?save"
```
Alternatively, pass the key and save parameters in the URL:
```shell
curl -X POST \
  --data-binary @/tmp/alter.yaml \
  "http://127.0.0.1:3000/conf?key=$MASTERKEY&save"
```

When save is provided, Aralez overwrites the local upstreams.yaml file with the configuration received through the API. The new configuration is applied immediately and persists across subsequent restarts.

**Exposing the configuration API securely**

The configuration API supports built-in authentication through the `API-KEY` header or the key query parameter. However, the API itself **does not support TLS** and must never be exposed directly to untrusted networks.

If remote access is required, keep the API bound to `127.0.0.1`and expose it through a properly configured reverse proxy. The proxy can terminate TLS, change authentication type, and forward requests to the local API.

For example, the following configuration uses HTTP Basic Authentication at the proxy and forwards the master key to the local API using the API-KEY header:

Example: 
```yaml
    config.example.com:
    paths:
      "/conf":
        authorization:
          type: "basic"
          data: "root:toor"
        server_headers:
          - "API-KEY:YOUR_MASTER_KEY_STRING_HERE"
        healthcheck: false
        servers:
          - "127.0.0.1:3000"
```
Replace the example credentials with secure values. Ensure that TLS is configured on the externally accessible endpoint and that the proxy forwards the authentication header as shown.

With this setup, you can access the configuration API over HTTPS using Basic Authentication:

```bash
curl -u root:REPLACE_WITH_A_STRONG_PASSWORD \
  -X POST --data-binary @configs/upstreams.yaml \
  https://config.example.com/conf
```
The reverse proxy authenticates the client using Basic Authentication and forwards the request to the local API with the required API-KEY header.

**Security warning**: 

Never expose config_address directly to the public internet or other untrusted networks. The built-in API does not support TLS and is not designed for direct exposure. For secure remote access, always use a properly configured reverse proxy with TLS and authentication.

---

## Status API

### Get upstreams with current live status

```bash
curl 127.0.0.1:3000/status?live
```

Example output:

```json
{
    "mip.domain.com": {
        "/": {
            "backends": [
                {
                    "address": "127.0.0.1",
                    "alive": false,
                    "port": 8000
                }
            ]
        }
    },
    "polo.domain.com": {
        "/": {
            "backends": [
                {
                    "address": "192.168.1.1",
                    "alive": true,
                    "port": 8000
                }
            ]
        }
    }
}
```

---

### Get full list of configured upstreams

```bash
curl 127.0.0.1:3000/staus?all
```

Example output:

```json
{
    "mip.domain.com": {
        "/": {
            "backends": [
                {
                    "address": "127.0.0.1",
                    "port": 8000,
                    "is_ssl": false,
                    "is_http2": false,
                    "to_https": false,
                    "rate_limit": 200,
                    "healthcheck": null
                }
            ],
            "requests": 0
        }
    },
    "polo.domain.com": {
        "/": {
            "backends": [
                {
                    "address": "192.168.1.1",
                    "port": 8000,
                    "is_ssl": false,
                    "is_http2": false,
                    "to_https": false,
                    "rate_limit": null,
                    "healthcheck": null
                }
            ],
            "requests": 0
        }
    }
}
```
