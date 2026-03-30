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

5. **Run it:**

```shell
aralez-xxx-yyy -c main.yaml
```

---

## Or via Docker

```shell
docker run -d \
  -v /local/path/to/config:/etc/aralez:ro \
  -p 80:80 \
  -p 443:443 \
  sadoyan/aralez
```
