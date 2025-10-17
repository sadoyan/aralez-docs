## 🚀 Quick Start

### Run it manually:

Download the prebuilt binary for your architecture from releases section of [GitHub](https://github.com/sadoyan/aralez/releases) repo
Make the binary executable `chmod 755 ./aralez-VERSION` and run.
---
**File names:**

| File Name                 | Description                                                              |
|---------------------------|--------------------------------------------------------------------------|
| `aralez-x86_64-musl.gz`   | Static Linux x86_64 binary, without any system dependency                |
| `aralez-x86_64-glibc.gz`  | Dynamic Linux x86_64 binary, with minimal system dependencies            |
| `aralez-aarch64-musl.gz`  | Static Linux ARM64 binary, without any system dependency                 |
| `aralez-aarch64-glibc.gz` | Dynamic Linux ARM64 binary, with minimal system dependencies             |
| `sadoyan/aralez`          | Docker image on Debian 13 slim (https://hub.docker.com/r/sadoyan/aralez) |




1. **Download the latest release** for your architecture from [Releases](https://github.com/sadoyan/aralez/releases).  
   ```shell
   wget https://github.com/sadoyan/aralez/releases/download/vX.Y.Z/aralez-xxx-yyy.tar.gz
   tar -xzf aralez-xxx-yyy.tar.gz
   ```
2. Make it executable
```shell
chmod +x aralez-xxx-yyy
```
3. Copy example configuration and adjust to your needs:
```shell
wget https://raw.githubusercontent.com/sadoyan/aralez/refs/heads/main/etc/main.yaml
wget https://raw.githubusercontent.com/sadoyan/aralez/refs/heads/main/etc/upstreams.yaml
```
5. Edit to match your needs 
6. Run it 
```shell
aralez-xxx-yyy -c main.yaml
``` 

### Or via docker 
```shell
docker run -d \
  -v /local/path/to/config:/etc/aralez:ro \
  -p 80:80 \
  -p 443:443 \
  sadoyan/aralez
```