---
title: "Manage Certificates"
description: "Obtain and auto-renew SSL/TLS certificates with Aralez"
weight: 10
---
## TLS Support

To enable TLS for the proxy server.

- Set `proxy_address_tls` in `main.yaml`
- Provide at least on  `tls_certificate/tls_key_file` pair.
    - **First crt/key pair is required to create the TLS listener.**
    - This pair can be anything, even self-signed with dummy domain.
    - After getting normal certificate it can be deleted

## Native Let's Encrypt Integration

Since version **v0.92.4**, Aralez supports automatic ordering and
renewal of SSL/TLS certificates using Let's Encrypt via the HTTP-01
challenge.

### Requirements

Make sure that `proxy_configs/certificates` directory exists and writeable by user running Aralez.
For first run and binding to TLS address ate least one certificate/key pair is required. 
Make sure that `proxy_configs/certificates` contains any even self-signed certificate, key pair. 
Later  when at least one certificate is obtained these can be deleted.    

### Configuration

Aralez includes a built-in API server that responds to HTTP-01
challenges. This endpoint must be publicly accessible for your domain.

Update your `upstreams.yaml`:

``` yaml
your.domain.com:
  paths:
    "/":
      servers:
        - "192.168.1.1:8000"
        - "192.168.1.2:8000"
        - "192.168.1.3:8000"
    "/.well-known/acme-challenge":
      servers:
        - "127.0.0.1:3000"
```

This ensures Let's Encrypt can reach:

    http://your.domain.com/.well-known/acme-challenge/<token>

------------------------------------------------------------------------

## Register and Obtain Certificates

### Register (run once)

``` bash
curl -H 'x-api-key: MASTER_KEY_FROM_MAIN_CONFIG' http://127.0.0.1:3000/acme_create
```

### Request a Certificate

``` bash
curl -H 'x-api-key: MASTER_KEY_FROM_MAIN_CONFIG' http://127.0.0.1:3000/acme_order/your.domain.com
```

### Generated Files

-   `acme_credentials.json` -- ACME account credentials
-   `domains.json` -- list of managed domains

Certificates are stored in:

    CONFIG_DIR/autoconfigs/

Aralez automatically reloads certificates when they are updated. Renewal
is triggered \~30 days before expiration.

------------------------------------------------------------------------

## Using Lego (Advanced with DNS-01 challenge)

Lego is an external ACME client that supports additional providers and
DNS challenges.

### Step 1: Configure Aralez

In `main.yaml`:

    proxy_configs: /path/to/config/folder/

In `upstreams.yaml`:

``` yaml
myhost.mydomain.com:
  paths:
    "/":
      servers:
        - "127.0.0.1:8000"
    "/.well-known/acme-challenge":
      healthcheck: false
      servers:
        - "127.0.0.1:8899"
```

------------------------------------------------------------------------

### Step 2: Install Lego

Download from: https://github.com/go-acme/lego/releases

``` bash
chmod +x lego
sudo mv lego /usr/local/bin/
```

------------------------------------------------------------------------

### Step 3: Request Certificates

``` bash
lego   --key-type rsa2048   --domains="site1.example.com"   --email="your@email.com"   --accept-tos   --http.port=127.0.0.1:8899   --http run
```

Certificates will be stored in:

    ./.lego/certificates/

------------------------------------------------------------------------

### Step 4: Prepare Certificates for Aralez

``` bash
cat ./.lego/certificates/site1.example.com*.crt > /path/to/certs/example.com.crt
cat ./.lego/certificates/site1.example.com.key > /path/to/certs/example.com.key
```

------------------------------------------------------------------------

### Step 5: Auto Reload

Aralez automatically reloads certificates without restart.

Expected naming:

    example.com.crt
    example.com.key

------------------------------------------------------------------------

### Step 6: Renewal Script

``` bash
#!/bin/bash

lego --http renew

cat ./.lego/certificates/site1.example.com*.crt > /path/to/certs/example.com.crt
cat ./.lego/certificates/site1.example.com.key > /path/to/certs/example.com.key
```

Add to cron:

``` bash
0 9 * * * /path/to/script.sh
```

------------------------------------------------------------------------

## Using ZeroSSL

Replace ACME server:

``` bash
lego   --server "https://acme.zerossl.com/v2/DV90"   --eab   --kid "$KID"   --hmac "$HMAC"   --http run
```

------------------------------------------------------------------------

## 
Summary

-   Use built-in ACME for simplicity
-   Use Lego for flexibility (DNS, multi-provider)
-   Aralez supports hot reload of certificates
-   HTTP-01 is the default and recommended approach
