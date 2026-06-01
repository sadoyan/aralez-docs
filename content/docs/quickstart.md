---
title: "Quick Start"
description: "Get Aralez running in minutes — binary or Docker"
weight: 1
---

## Run it manually

Download the prebuilt binary for your architecture from the [releases section](https://github.com/sadoyan/aralez/releases) of the GitHub repo. Make the binary executable and run it.

### Available Binaries

| File Name                       | Description                                                              |
|---------------------------------|--------------------------------------------------------------------------|
| `aralez-x86_64-musl.gz`         | Static Linux x86_64 binary, without any system dependency                |
| `aralez-x86_64-glibc.gz`        | Dynamic Linux x86_64 binary, with minimal system dependencies            |
| `aralez-x86_64-compat-musl.gz`  | Static Linux x86_64 binary, compatible with old pre Haswell CPUs         |
| `aralez-x86_64-compat-glibc.gz` | Dynamic Linux x86_64 binary, compatible with old pre Haswell CPUs        |
| `aralez-aarch64-musl.gz`        | Static Linux ARM64 binary, without any system dependency                 |
| `aralez-aarch64-glibc.gz`       | Dynamic Linux ARM64 binary, with minimal system dependencies             |
| `sadoyan/aralez`                | Docker image on Debian 13 slim (https://hub.docker.com/r/sadoyan/aralez) |

---

### Steps

1. **Download the latest release** for your architecture from [Releases](https://github.com/sadoyan/aralez/releases):

```shell
wget https://github.com/sadoyan/aralez/releases/download/vX.Y.Z/aralez-xxx-yyy.tar.gz
tar -xzf aralez-xxx-yyy.tar.gz
```

2. **Make it executable:**

```shell
chmod +x aralez-xxx-yyy
```

3. **Copy example configuration** and adjust to your needs:

```shell
wget https://raw.githubusercontent.com/sadoyan/aralez/refs/heads/main/etc/main.yaml
wget https://raw.githubusercontent.com/sadoyan/aralez/refs/heads/main/etc/upstreams.yaml
```

4. Edit to match your needs.

5. Create certificates for first run  

```shell
mkdir /local/path/to/config/certificates
chown -R aralez:aralez /local/path/to/config
cd /local/path/to/config/certificates
openssl req -x509 -newkey rsa:4096 \
	-keyout dummy.key -out dummy.crt -sha256 -days 3650 -nodes \
	-subj "/C=XX/ST=StateName/L=CityName/O=CompanyName/OU=CompanySectionName/CN=CommonNameOrHostname"
```
6. **Run it:**

```shell
aralez-xxx-yyy -c main.yaml
```

---

## Or via Docker

The Dockerfile: 

```dockerfile
FROM debian:trixie-slim

RUN apt-get update && apt-get install -y ca-certificates curl net-tools iputils-ping
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

COPY aralez /usr/local/bin/aralez

RUN chmod +x /usr/local/bin/aralez
RUN mkdir -p /etc/aralez/certs/upstreams

WORKDIR /etc/aralez

ENTRYPOINT ["/usr/local/bin/aralez", "-c", "/etc/aralez/main.yaml"]
```
Run: 

```shell
docker run -d \
  -v /local/path/to/config:/etc/aralez:rw \
  -p 80:80 \
  -p 443:443 \
  sadoyan/aralez
```

`/etc/aralez/certificates` in container should contain at least one crt/key pair. This can be self-signed dummy certificate. Aralez need a certificate to bind to TLS port.  
Make sure you have created `/local/path/to/config/certificates` and installed this certificate before starting Aralez. 

