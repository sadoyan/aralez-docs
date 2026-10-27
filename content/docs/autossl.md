---
title: "Manage Certificates"
description: "Get and automatically renew SSL/TLS certificates with Aralez"
weight: 10
---

## TLS basics

TLS (HTTPS) is off until you turn it on. To enable it:

1. Set `proxy_address_tls` in `main.yaml`.
2. Put at least one certificate and key pair (`NAME.crt` and `NAME.key`) in the certificates directory.
3. New certificates and key will be loaded on the fly without rest. 

Aralez needs a first certificate and key pair to start the TLS listener. This pair can be anything, including a self-signed certificate for a dummy domain. Once you have a real certificate, you can delete it.

Certificate files must follow these rules:

- Use plain-text **PEM** format.
- Give the certificate and key the same base name, with `.crt` and `.key` extensions. For example: `example.com.crt` and `example.com.key`.

## Let's Encrypt (automatic certificates)

Since **v0.92.4**, Aralez can order and renew certificates from Let's Encrypt by itself. It supports two ways of proving you own the domain:

- **HTTP-01:** Let's Encrypt requests a special URL on your domain. This is simple, but your domain must be reachable from the internet on port 80.
- **DNS-01:** Aralez adds a temporary TXT record to your DNS zone. This needs no public web access and is described in the DNS-01 section below. It is available since **v0.94.2**.

### Before you start

- The directory `proxy_configs/certificates` must exist, and the user running Aralez must be able to write to it.
- It must contain at least one certificate and key pair, even a self-signed one, so the TLS listener can start. You can delete it after you get your first real certificate.

### Set up HTTP-01

Aralez has a small built-in API server that can answer the Let's Encrypt challenge. You only need to route the challenge path to it in `upstreams.yaml`:

```yaml
your.domain.com:
  paths:
    "/":
      servers:
        - "192.168.1.1:8000"
        - "192.168.1.2:8000"
        - "192.168.1.3:8000"
    "/.well-known/acme-challenge":
      servers:
        - "127.0.0.1:3000" # address:port of Aralez's internal API server
```

Let's Encrypt will then be able to reach:

```
http://your.domain.com/.well-known/acme-challenge/<token>
```

### Files Aralez creates

Aralez creates an `autoconfigs` folder inside your config directory with two files:

```
acme_credentials.json
domains.json
```

Aralez manages both files, so don't edit them by hand.

- `acme_credentials.json` holds your Let's Encrypt account. A healthy file looks like this:

  ```json
  {
    "id": "https://acme-v02.api.letsencrypt.org/acme/acct/YOUR_ID",
    "key_pkcs8": "YOUR_KEY",
    "directory": "https://acme-v02.api.letsencrypt.org/directory"
  }
  ```

- `domains.json` lists the domains that use automatic certificates:

  ```json
  [
    "host1.example.com",
    "host2.example.com",
    "host1.example.net",
    "host2.example.net"
  ]
  ```

After setup, your config directory should look like this:

```bash
etc/
├── autoconfigs
│   ├── acme_credentials.json
│   └── domains.json
├── certificates
│   ├── host1.example.com.crt
│   ├── host1.example.com.key
│   ├── host2.example.com.crt
│   ├── host2.example.com.key
│   ├── host1.example.net.crt
│   ├── host1.example.net.key
│   ├── host2.example.net.crt
│   └── host2.example.net.key
├── main.yaml
└── upstreams.yaml
```

## Create an account and order certificates

### Step 1: Create your Let's Encrypt account

Do this once, the first time you run Aralez:

```bash
curl http://127.0.0.1:3000/acme_create
```

This creates your account at Let's Encrypt and saves the credentials in `autoconfigs/acme_credentials.json`. Don't run it again on the same installation.

### Step 2: Order a certificate for each domain

```bash
curl http://127.0.0.1:3000/acme_order/host1.example.com
curl http://127.0.0.1:3000/acme_order/host2.example.com
curl http://127.0.0.1:3000/acme_order/host1.example.net
curl http://127.0.0.1:3000/acme_order/host2.example.net
```

Each command gets a certificate and saves the `.crt` and `.key` files in the `certificates` folder, as shown in the tree above.

You only need to run each order command once per domain.

### Renewal

Aralez renews certificates automatically, starting about 30 days before they expire. It also reloads renewed certificates on its own, so you don't need to restart anything.

## DNS-01 challenge

With DNS-01, Aralez proves domain ownership by creating a temporary TXT record through your DNS provider's API. It then deletes the record. Ordering and renewal work the same way as with HTTP-01.

To enable it, set `acme_dns_provider` in `main.yaml` to the provider's name:

```yaml
acme_dns_provider: cloudflare
```

Each provider needs credentials, which you pass as environment variables. **Restart Aralez after setting them so it can read them.**

More providers will be added over time.

### Cloudflare

```yaml
acme_dns_provider: cloudflare
```

```shell
export CLOUDFLARE_API_TOKEN="YOUR_TOKEN_HERE"
export CLOUDFLARE_ZONE_ID="YOUR_ZONE_ID_HERE"
```

### Route53 (AWS)

```yaml
acme_dns_provider: route53
```

You need the `AWS_HOSTED_ZONE_ID` environment variable plus the usual AWS credentials. Set those as environment variables, or put them in the `~/.aws` folder like you would for the `aws` CLI:

```shell
export AWS_HOSTED_ZONE_ID="YOUR_ZONE_ID_HERE"
export AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
export AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
export AWS_DEFAULT_REGION=us-west-2
```

### DigitalOcean

```yaml
acme_dns_provider: digitalocean
```

```shell
export DIGITALOCEAN_TOKEN="YOUR_TOKEN_HERE"
```

## Writing your own DNS-01 provider

If your DNS provider isn't supported, you can add it yourself. A provider is a small Rust file that knows how to create and delete a TXT record.

1. Create the file `src/tls/acme/dns/example.rs`.
2. Add `pub mod example;` to `src/tls/acme/dns/mod.rs`.
3. Set `acme_dns_provider: example` in `main.yaml`.

### What goes in `example.rs`

**Imports**

```rust
use crate::tls::acme::lookup::lookup_wait;
use crate::tls::acme::types::{DnsBackendPlugin, DnsProvider};
```

**A struct for your provider.** Read your credentials from environment variables in `new()`:

```rust
pub struct ExampleProvider {
    pub hosted_zone_id: String,
}

impl ExampleProvider {
    pub fn new() -> Self {
        Self {
            hosted_zone_id: std::env::var("HOSTED_ZONE_ID").unwrap_or_default(),
        }
    }
}
```

**The `DnsProvider` trait.** It has two functions: one that creates the TXT record and one that deletes it. Fill them in with your provider's API calls:

```rust
#[async_trait::async_trait]
impl DnsProvider for ExampleProvider {
    async fn create_txt_record(&self, _domain: &str, _name: &str, _value: &str) -> Result<String, Box<dyn std::error::Error + Send + Sync>> {
        todo!()
    }
    async fn delete_txt_record(&self, _record_id: &str, _record_name: &str) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
        todo!()
    }
}
```

**Register the plugin** so Aralez can find it by name:

```rust
inventory::submit! {
    DnsBackendPlugin {
        name: "example",
        factory: || Box::new(ExampleProvider::new()),
    }
}
```

**Wait for DNS to update.** A new TXT record can take a moment to become visible. Call `lookup_wait` at the end of `create_txt_record`. It keeps querying DNS until the record shows the expected value, or until the timeout runs out. Its parameters are:

1. `name`: the TXT record to look up.
2. A DNS server to ask (optional).
3. A timeout in seconds.
4. The value the record should have.

```rust
lookup_wait(name, Some("1.1.1.1"), 60, value).await;
```

Once it is built, set your plugin as the provider in `main.yaml`:

```yaml
acme_dns_provider: example
```