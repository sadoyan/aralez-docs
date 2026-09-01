---
title: "Consul Integration"
description: "Running Aralez as service mesh for Nomad services with Consul"
---

Make sure you have access to Consul API. Add Consul servers in upstreams file. 
If consul authentication is enabled , get API token and add to config file. 
All configs except authentication at virtual host / path level are working as with configuration via plain config file . 

Aralez can be deployed, both as Nomad services or as a stand-alone application. 
The only requirement is access to API of consul servers, and  Nomad services `ServicePort` & `ServiceAddress`

Below is minimal upstreams file for Consul. 

```yaml
provider: "consul"
sticky_sessions: 172000
to_https: false
rate_limit: 500000
x4xx_limit: 100000
server_headers:
  - "X-Global-For-Servers:Something"
client_headers:
  - "X-Global-For-Clients:Something"
#authorization:
#  type: "basic"
#  data: "root:toor"
#  type: "jwt"
#  data: "910517d9-f9a1-48de-8826-dbadacbd84af-cb6f830e-ab16-47ec-9d8f-0090de732774"
#    type: "apikey"
#    data: "5ecbf799-1343-4e94-a9b5-e278af5cd313-56b45249-1839-4008-a450-a60dc76d2bae"
consul:
  servers:
    - "http://consul1:8500"
    - "http://consul2:8500"
    - "http://consul3:8500"
  token: "8e2db809-845b-45e1-8b47-2c8356a09da0-a4370955-18c2-4d6e-a8f8-ffcc0b47be81" # Consul server access token, If Consul auth is enabled
```

The rest of configuration parameters Aralez will take and periodically update from Consul's API

## Deploying service 

configuration of upstreams is done trough TAGs in nomad job definition in format `aralez.key=value`.  
In order to filter services, Aralez will query Consul for services with hardcoded tag `aralez.service=yes`. 
Only services with this tag will be configured as upstreams. 
2 more mandatory tags for services are required. `"aralez.host=your.example.com"` and `"aralez.path=/"`. 
To populate configure internal routing . 

All other parameters, as with `file` config parameter are optional . 

Minimal tags in Nomad job definition file. : 

```hcl
 tags = [
    "aralez.service=yes",
    "aralez.host=nginx.blablabla.com",
    "aralez.path=/",
]
```

Full list of supported tags.
```hcl
tags = [
    "aralez.service=yes",
    "aralez.host=nginx.example.com",
    "aralez.path=/",
    
    "aralez.rate=1",
    "aralez.4xx_rate=10",
    "aralez.to_https=true",
    "aralez.client_header=X-Some:Some Random Header",
    "aralez.client_header=X-Emos:Redaeh Modnar Emos",
    "aralez.server_header=X-From:Aralez & Consul",
    "aralez.server_header=X-Mrof: Lusnoc & Zelara",
]
```
You can duplicate as many as neede `aralez.client_header` & `aralez.server_header` keys . 
All values after `=` will be applied as client/server side headers. 

## Full Example of a Nomad job definition file, used for internal testing.

```hcl
job "nginx" {
  meta {
    uuid = uuidv4()
  }
  datacenters = ["eu-ams-1"]
  type = "service"
  constraint {
    attribute = node.unique.name
    operator  = "regexp"
    value     = "consul[0-9]"
  }
  update {
    max_parallel      = 1
    min_healthy_time  = "10s"
    healthy_deadline  = "3m"
    progress_deadline = "10m"
    auto_revert       = false
    canary            = 0
  }
  migrate {
    max_parallel     = 1
    health_check     = "checks"
    min_healthy_time = "10s"
    healthy_deadline = "5m"
  }
  group "NginX" {
    network {
      port "nginx" { to = 80 }
    }
    constraint {
      operator = "distinct_hosts"
      value    = "true"
    }
    count = 3
    restart {
      attempts = 2
      interval = "30m"
      delay    = "15s"
      mode     = "fail"
    }
    task "server" {
      service {
        port = "nginx"
        tags = [
          "aralez.service=yes",
          "aralez.host=nginx.example.com",
          "aralez.path=/",
          "aralez.rate=10",
          "aralez.4xx_rate=5",
          "aralez.to_https=true",
          "aralez.client_header=X-Some:Some Random Header",
          "aralez.client_header=X-Emos:Redaeh Modnar Emos",
          "aralez.server_header=X-From:Aralez & Consul",
          "aralez.server_header=X-Mrof: Lusnoc & Zelara",
        ]
        check {
          type     = "http"
          port     = "nginx"
          path     = "/"
          interval = "5s"
          timeout  = "2s"
        }
      }
      driver = "docker"
      config {
        image      = "nginx:latest"
        force_pull = true
        ports = ["nginx"]
      }
    }
  }
}
```

This will: 
- Deploy official Nginx container on 3 nodes.  
- Register Nomad service in Consul registry.
- Add necessary internal (Not for Aralez) healtcheks.
- Register as Aralez discoverable service 
- Requests to host nginx.example.com with path / will be routed to upstreams
- Requests to this hosts will be limited to 10 per second from single IP.  
- 4xx Requests to this hosts will be limited to 5 per second from single IP.
- All `http` requests will be redirected to `https`
- Client and servers will be injected to request/responses 


[**Here**](https://github.com/sadoyan/aralez/tree/main/etc/consul): are some more Nomad job definition files 
