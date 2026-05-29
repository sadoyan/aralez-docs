---
title: "API"
description: "Remote Config API and Status API reference"
weight: 3
---

## Remote Config API

Push a new `upstreams.yaml` over HTTP to `config_address` (`:3000` by default). Useful for CI/CD automation or remote config updates. The URL parameter `key=MASTERKEY` is required — its value matches `master_key` in `main.yaml`.

```bash
curl -XPOST --data-binary @./etc/upstreams.txt 127.0.0.1:3000/conf
   or 
curl -XPOST --data-binary @/tmp/upstreams.yaml 127.0.0.1:3000/conf
```
If url parameter `?save` exists, Aralez will overwrite local `upstreams.yaml` file with versions received from API. 
Otherwise, new pushed upstreams configration is ephemeral and will work till next restart.  

**Example**

```bash
curl -XPOST --data-binary @/tmp/upstreams.yaml 127.0.0.1:3000/conf?save
```

---

## Status API

### Get upstreams with current live status

```bash
curl 127.0.0.1:3000/staus?live
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
