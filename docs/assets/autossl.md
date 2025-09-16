## 🔐 Obtain and Renew SSL/TLS Certificates with [**Lego**](https://go-acme.github.io/lego/)

Securing your applications with HTTPS is not just a best practice – it’s **essential**! 🚀  
With **Lego**, an ACME client and companion of Let’s Encrypt, you can easily obtain and auto-renew SSL/TLS certificates for your domains.  
This guide will walk you through preparing **Aralez** for ACME challenges and integrating certificates smoothly. 🌍🔑

---

## ⚙️ Step 1: Prepare Aralez for ACME Challenge

In order to respond to certificate validation requests, you need to expose the path `/.well-known/acme-challenge` in your upstream configuration.  
This allows **Let’s Encrypt** (or another ACME CA) to verify that you own the domain.  

Here’s a sample configuration:  

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

* healthcheck: false ensures Aralez does not remove the ephemeral upstreams (temporary validation servers) from the proxy pool.
* Once saved, Aralez will auto-reload the configuration 🔄 – no manual restart needed!

## 📥 Step 2: Download and Install Lego

Getting Lego installed is a breeze! 🪄

1. Visit the official [**releases page**](https://github.com/go-acme/lego/releases).
2. Download the precompiled binary for your OS.
3. Extract it (untar if necessary).
4. Make the binary executable: `chmod +x lego`
5. Move it into your $PATH (e.g., /usr/local/bin): `sudo mv lego /usr/local/bin/`

## 📜 Step 3: Request Certificates

Use Lego to request SSL certificates for one or more domain
```shell
lego --key-type rsa2048 \
  --domains="site1.example.com" \
  --domains="site2.example.com" \
  --domains="site3.example.com" \
  --email "your-email@example.com" \
--http.port=127.0.0.1:8899 --http run
```

### 🔎 What happens here?
* --key-type → sets the type of cryptographic key (RSA 2048 in this case).
* --domains → add one or multiple domains you want to secure.
* --email → your contact email (used by Let’s Encrypt).
* --http.port → the local port Lego will bind for the HTTP challenge.

Certificates will be created in the ./.lego/certificates/ directory. 🗂️

## 🔗 Step 4: Make Certificates Usable for Aralez

Combine and copy the certificates into a path where Aralez expects them:
```shell
cat ./.lego/certificates/site1.example.com*.crt > /path/for/certificates/for/aralez/example.com.crt
cat ./.lego/certificates/site1.example.com.key > /path/for/certificates/for/aralez/example.com.key
```
💡 Pro tip:

Instead of manual steps, you can automate with Lego’s built-in hook system using --run-hook.

More details: [**Lego CLI Docs**](https://go-acme.github.io/lego/usage/cli/obtain-a-certificate/index.html) 📚

## 🎉 Step 5: Automatic Reload with Aralez

The magic part ✨ – Aralez automatically detects changes to your certificates and reloads them on the fly.
**No downtime. No hassle**. Just pure HTTPS goodness. 🔒🚀

**💡 Important tip: Aralez expects certificates and keys to follow a specific naming convention:**

1. Certificate files must have the .crt extension.
2. Private key files must have the .key extension.
3. Matching .crt and .key files must share the same filename prefix.

**📂 Example:**

* `example.com.crt`
* `example.com.key`

🔎 The exact prefix doesn’t matter (it can be any string), but it must be unique per certificate.

Aralez scans the certificate and key files, then matches them in memory by content. This ensures the correct pairs are always loaded together.

## 📜 Step 5: Renewing certificates

The easiest is to create a tiny wrapper bash script and put it in crontab.

```shell
#!/bin/bash

lego --key-type rsa2048 \
  --domains="site1.example.com" \
  --domains="site2.example.com" \
  --domains="site3.example.com" \
  --email "your-email@example.com" \
--http.port=127.0.0.1:8899 --http run

cat ./.lego/certificates/site1.example.com*.crt > /path/for/certificates/for/aralez/example.com.crt
cat ./.lego/certificates/site1.example.com.key > /path/for/certificates/for/aralez/example.com.key
```

Crontab entry 

```shell
0 9 * * * /path/to/lego.sh
```