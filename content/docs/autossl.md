---
title: "Manage Certificates"
description: "Obtain and auto-renew SSL/TLS certificates with Aralez"
weight: 10
---
## TLS Support

To enable TLS for the proxy server.

- Set `proxy_address_tls` in `main.yaml`
- Provide at least one `tls_certificate/tls_key_file` pair.
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
        - "127.0.0.1:3000" # The address:port of internal API server
```

This ensures Let's Encrypt can reach:

```
http://your.domain.com/.well-known/acme-challenge/<token>
````

Aralez will create CONF_DIR/autoconfig folder with following files

```
acme_credentials.json
domains.json
```
These are autocreated files, never manually edit it. 

Helthy content of `etc/autoconfigs/acme_credentials.json` should look like this: 

```json
{
  "id": "https://acme-v02.api.letsencrypt.org/acme/acct/YOUR_ID",
  "key_pkcs8": "YOUR_KEY",
  "directory": "https://acme-v02.api.letsencrypt.org/directory"
}
```
File `etc/autoconfigs/domains.json` contains The list of ACME enable hosts . 

```json
[
  "host1.example.com",
  "host2.example.com",
  "host1.example.net",
  "host2.example.net"
]
```

Healthy structure of `etc` should look like this: 


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
│   ├── host2.example.com.crt
│   └── host2.example.com.key
├── main.yaml
└── upstreams.yaml

```

## Register and Obtain Certificates

### Register 

On the first run of Aralez at first time execute the following in your command prompt.  

``` bash
curl http://127.0.0.1:3000/acme_create
```
This will create your account at Let's Encrypt and save credentials in  `etc/autoconfigs/domains.json`
This should be run only once on a fresh Aralez installation. 

### Request a Certificate

For each of your domains run 

``` bash
curl http://127.0.0.1:3000/acme_order/host1.example.com
curl http://127.0.0.1:3000/acme_order/host2.example.com
curl http://127.0.0.1:3000/acme_order/host1.example.net
curl http://127.0.0.1:3000/acme_order/host2.example.net
```

This will issue initial certificates and store as 
```
├── certificates
│   ├── host1.example.com.crt
│   ├── host1.example.com.key
│   ├── host2.example.com.crt
│   ├── host2.example.com.key
│   ├── host1.example.net.crt
│   ├── host1.example.net.key
│   ├── host2.example.com.crt
│   └── host2.example.com.key
```

Renewal of certificates will be performed automatically. 

You need to run `curl http://127.0.0.1:3000/acme_order/DOMAIN` only once to issues the certificates.   

### File system permissions

Make sure the user running Aralez have write permission to config directory.  

Aralez automatically reloads certificates when they are updated. The renewal is triggered \~30 days before expiration.

## DNS-01 challenge

Starting from version 0.94.2 Aralez supports ACME DNS-01 challenge. 
Support for different provider will be added granularly. 
At the moment of this document (version 0.94.2) only Cloudflare DNS is supported.

To enable DNS-01 challenge in `main.yaml` add key `acme_dns_provider` with value of a provider plugin name. 
```yaml
acme_dns_provider: cloudflare
```

Cloudflare plugin requires `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ZONE_ID` environment variables. 

```shell
export CLOUDFLARE_API_TOKEN="YOUR_TOKEN_HERE"
export CLOUDFLARE_ZONE_ID="YOUR_ZONE_ID_HERE"
```
Restart Aralez to read these enviroment variables . 

Ordering and renewing of certificates is processed the same was as with HTTP-01 challenge. 

## Developing custom DNS-01 challenge plugins.

- Create a plugin file inside `src/tls/acme/dns/`, -> `src/tls/acme/dns/example.rs`
- Add file name to `src/tls/acme/dns/mod.rs` -> `pub mod example`;
- Enable in `main.yaml` -> `acme_dns_provider: example`

### Inside example.rs file

Imports.

```rust
use crate::tls::acme::lookup::lookup_wait;
use crate::tls::acme::types::{DnsBackendPlugin, DnsProvider};
```

Create and initialize your plugin struct with method new():
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

Implement trait `DnsProvider` for your provider.  
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

Submit to inventory
```rust
inventory::submit! {
    DnsBackendPlugin {
        name: "example",
        factory: || Box::new(ExampleProvider::new()),
    }
}
```

Waiting for propagated TXT

include function below after creating TXT records in `create_txt_records` to enable lookup loop and wait till TXT records are queryable. 
It accepts the following parameters :

1. name: the txt record to lookup 
2. Optionally DNS server to query. 
3. Timeout in seconds. 
4. Expected value for query 

`lookup_wait` will start lookups in loops fot TXT record `name`.  If `value` matches real value or timeout exceeds the loop will exit.  

```rust
lookup_wait(name, Some("1.1.1.1"), 60, value).await;
```

Now you can use new plugin just by editing `main.yaml` and setting it as prevered `acme_dns_provider`
```yaml
acme_dns_provider: example
```

------------------------------------------------------------------------