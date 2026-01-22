
## 📡 Remote Config API

Push new `upstreams.yaml` over HTTP to `config_address` (`:3000` by default). Useful for CI/CD automation or remote config updates.
URL parameter. `key=MASTERKEY` is required. `MASTERKEY` is the value of `master_key` in the `main.yaml`

```bash
curl -XPOST --data-binary @./etc/upstreams.txt 127.0.0.1:3000/conf?key=${MASTERKEY}
```

## 📡 Status API

**Get the list of upstreams with current status.**  

```bash
curl 127.0.0.1:3000/staus?live
```
Example putput 

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

**Get the full list of configured upstreams with configurations parameters**

```bash
curl 127.0.0.1:3000/staus?all
```
Example output

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

 
