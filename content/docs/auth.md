---
title: "Authentication"
description: "Basic Auth, API Key, and JWT authentication"
weight: 4
---

## Authentication (Optional)

Authentication works on two levels: **Global** and **per path**.

If **Global** authentication is enabled, per-path authentication is ignored. Both `web.example.com` and `www.example.com` in the example below require `root:toor` credentials from the global section — the per-path `admin:admin` on `www.example.com` is overridden.

The same applies to all methods (**basic, jwt, api**). Global always overrides per-path.

```yaml
provider: "file"
sticky_sessions: false
to_https: false
rate_limit: 100
authorization:
  type: "basic"
  data: "root:toor"
upstreams:
  web.example.com:
    paths:
      "/":
        servers:
          - "127.0.0.3:8000"
          - "127.0.0.4:8000"
  www.example.com:
    paths:
      "/":
        to_https: false
        authorization:
          type: "basic"
          data: "admin:admin"
        servers:
          - "127.0.0.1:8000"
          - "127.0.0.2:8000"
```

---

## Authentication Methods

Only one method can be active at a time:

- **`basic`** — Standard HTTP Basic Authentication. `data` must be `user:pass`
- **`apikey`** — Authentication via `x-api-key` header, which must match the value in config. `data` must be the actual `api_key` 
- **`jwt`** — JWT authentication via `araleztoken=` URL parameter or `Authorization: Bearer <token>` header. `data` must be the `masterkey`
- **`forward`** — Zero trust forward authentication. `data` must be the full URL to authentication server including `http://`, `https://` preffix

---

## JWT Authentication

To obtain a JWT token, send a **generate** request to the built-in API server's `/jwt` endpoint.

| Field | Description |
|---|---|
| `master_key` | Must match `masterkey` in `main.yaml` and `upstreams.yaml` |
| `owner` | Placeholder — can be anything |
| `exp` | Token expity in minutes |

### Generate a JWT Token

```bash
PAYLOAD='{
    "master_key": "910517d9-f9a1-48de-8826-dbadacbd84af-cb6f830e-ab16-47ec-9d8f-0090de732774",
    "owner": "valod",
    "exp": 10
}'

TOK=`curl -s -XPOST -H "Content-Type: application/json" -d "$PAYLOAD" http://127.0.0.1:3000/jwt | cut -d '"' -f4`
echo $TOK
```

### Request with JWT via Bearer Header

```bash
curl -H "Authorization: Bearer ${TOK}" -H 'Host: myip.mydomain.com' http://127.0.0.1:6193/
```

### Request with JWT via URL Parameter

Very useful for generating and sharing temporary links:

```bash
curl -H 'Host: myip.mydomain.com' "http://127.0.0.1:6193/?araleztoken=${TOK}"
```

---

## API Key Authentication

```bash
curl -H "x-api-key: ${APIKEY}" --header 'Host: myip.mydomain.com' http://127.0.0.1:6193/
```

---

## Basic Auth

```bash
curl -u username:password -H 'Host: myip.mydomain.com' http://127.0.0.1:6193/
```

## Forward Auth

```bash
curl -H 'Host: myip.mydomain.com' --cookie "YOUR_AUTH_COOKIE" http://127.0.0.1:6193/
```
