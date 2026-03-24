---
title: "Manage Certificates"
description: "Obtain and auto-renew SSL/TLS certificates using Lego and Let's Encrypt with Aralez"
weight: 10
---

## 🔐 Obtain and Renew SSL/TLS Certificates with [Lego](https://go-acme.github.io/lego/)

Securing your applications with HTTPS is not just a best practice – it's **essential**! 🚀

With **Lego**, an ACME client and companion of Let's Encrypt, you can easily obtain and auto-renew SSL/TLS certificates for your domains. This guide will walk you through preparing **Aralez** for ACME challenges and integrating certificates smoothly. 🌍🔑

---

## ⚙️ Step 1: Prepare Aralez for ACME Challenge

In order to respond to certificate validation requests, you need to expose the path `/.well-known/acme-challenge` in your upstream configuration. This allows **Let's Encrypt** (or another ACME CA) to verify that you own the domain.

Edit `main.yaml` and set the correct folder for `proxy_certificates`:

```
proxy_certificates: /path/to/certificates/for/aralez/
```

> Basic settings in `main.yaml` require a restart of Aralez.

Edit `upstreams.yaml` with a sample configuration:

```yaml
myhost.mydomain.com:
  paths:
    "/":
      headers:
        - "X-Some-Thing:Yaaaaaaaaaaaaaaa"
      servers:
        - "127.0.0.1:8000"
        - "127.0.0.2:8000"
    "/.well-known/acme-challenge":
      healthcheck: false
      servers:
        - "127.0.0.1:8899"
```

✨ **Important Notes:**

- `healthcheck: false` ensures Aralez does not remove the ephemeral upstreams (temporary validation servers) from the proxy pool.
- Once saved, Aralez watches and auto-reloads `upstreams.yaml` 🔄 — no manual restart needed!

---

## 📥 Step 2: Download and Install Lego

1. Visit the official [releases page](https://github.com/go-acme/lego/releases).
2. Download the precompiled binary for your OS.
3. Extract it (untar if necessary).
4. Make the binary executable: `chmod +x lego`
5. Move it into your `$PATH`: `sudo mv lego /usr/local/bin/`

---

## 📜 Step 3: Request Certificates

Use Lego to request SSL certificates for one or more domains:

```shell
cd /path/to/lego/root/folder

lego --key-type rsa2048 \
  --domains="site1.example.com" \
  --domains="site2.example.com" \
  --domains="site3.example.com" \
  --email "your-email@example.com" \
  --accept-tos \
  --http.port=127.0.0.1:8899 --http run
```

### 🔎 What happens here?

| Flag | Description |
|---|---|
| `--key-type` | Type of cryptographic key (RSA 2048) |
| `--domains` | One or multiple domains to secure |
| `--email` | Contact email (used by Let's Encrypt) |
| `--http.port` | Local port Lego binds for the HTTP challenge |
| `--accept-tos` | Accept Let's Encrypt terms of service |

Certificates will be created in `./.lego/certificates/`. 🗂️

---

## 🔗 Step 4: Make Certificates Usable for Aralez

Combine and copy the certificates into the path where Aralez expects them:

```shell
cat ./.lego/certificates/site1.example.com*.crt > /path/to/certificates/for/aralez/example.com.crt
cat ./.lego/certificates/site1.example.com.key > /path/to/certificates/for/aralez/example.com.key
```

> 💡 **Pro tip:** You can automate this with Lego's built-in hook system using `--run-hook`. See the [Lego CLI Docs](https://go-acme.github.io/lego/usage/cli/obtain-a-certificate/index.html) for details.

---

## 🎉 Step 5: Automatic Reload with Aralez

✨ **Aralez will automatically detect changes of certificates and reload on the fly. No downtime**

**💡 Naming convention:** Aralez expects certificates and keys to follow a specific format:

1. Certificate files must have the `.crt` extension.
2. Private key files must have the `.key` extension.
3. Matching `.crt` and `.key` files must share the same filename prefix.

**Example:**

```
example.com.crt
example.com.key
```

Aralez scans the certificate and key files, then matches them in memory by content, ensuring the correct pairs are always loaded together.

---

## 🔁 Step 6: Renewing Certificates

Create a wrapper bash script and add it to crontab:

```shell
#!/bin/bash

cd /path/to/lego/root/folder

lego --key-type rsa2048 \
  --domains="site1.example.com" \
  --domains="site2.example.com" \
  --domains="site3.example.com" \
  --email "your-email@example.com" \
  --accept-tos \
  --http.port=127.0.0.1:8899 --http $1

cat ./.lego/certificates/site1.example.com*.crt > /path/to/certificates/for/aralez/example.com.crt
cat ./.lego/certificates/site1.example.com.key > /path/to/certificates/for/aralez/example.com.key
```

Add a crontab entry to run daily at 9am:

```shell
0 9 * * * /path/to/lego.sh renew
```

---

## ⚙️ Using ZeroSSL Instead of Let's Encrypt

1. Create an account at ZeroSSL.
2. Login and go to [Developer](https://app.zerossl.com/developer).
3. Generate and save your `KID` and `HMAC`.

**Create a wrapper script `lego.sh`:**

```shell
#!/bin/bash

cd /path/to/lego/root/folder

lego --key-type rsa2048 \
    --domains="site1.example.com" \
    --domains="site2.example.com" \
    --email "your-email@example.com" \
    --accept-tos \
    --server "https://acme.zerossl.com/v2/DV90" \
    --eab --kid "$YOUR_KID" \
    --hmac "$YOUR_HMAC" \
    --http.port=127.0.0.1:8899 --http $1

cat ./.lego/certificates/site1.example.com*.crt > /path/to/certificates/for/aralez/example.com.crt
cat ./.lego/certificates/site1.example.com.key > /path/to/certificates/for/aralez/example.com.key
```

| Flag | Description |
|---|---|
| `--server` | URL to ZeroSSL server |
| `--eab` | EAB copied from ZeroSSL developer section |
| `--hmac` | HMAC copied from ZeroSSL developer section |

**Obtain the certificate:**

```shell
./lego.sh run
```

**Renew the certificate:**

```shell
./lego.sh renew
```
