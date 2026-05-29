---
title: "Kubernetes Ingress"
description: "Running Aralez inside a Kubernetes cluster as a lightweight ingress proxy"
weight: 7
---

This guide walks you through setting up Aralez inside a Kubernetes cluster as a lightweight service mesh. We'll create the necessary **ServiceAccount**, apply the right **RBAC roles**, and deploy Aralez as a Kubernetes Deployment with an exposed Service.

---

## Step 1: Create a Service Account

Aralez needs a ServiceAccount with permissions to watch Kubernetes resources like pods, endpoints, and services.

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: aralez-sa
```

---

## Step 2: Define RBAC Permissions

Aralez requires read-only access to Kubernetes resources within a namespace.

**Role (scoped to a single namespace):**

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: aralez-role
rules:
  - apiGroups: [ "" ]
    resources: [ "pods", "endpoints", "services" ]
    verbs: [ "get", "list", "watch" ]
```

**RoleBinding (attach Role to the ServiceAccount):**

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: aralez-binding
subjects:
  - kind: ServiceAccount
    name: aralez-sa
roleRef:
  kind: Role
  name: aralez-role
  apiGroup: rbac.authorization.k8s.io
```

---

## Step 3: Deploy Aralez

### ConfigMaps for `main.yaml` and `upstreams.yml`

**main.yml example:**

```yaml
threads: 12
daemon: false
upstream_keepalive_pool_size: 500
pid_file: /tmp/aralez.pid
error_log: /tmp/aralez_err.log
upgrade_sock: /tmp/aralez.sock
config_api_enabled: false
config_address: 127.0.0.1:3000
proxy_address_http: 0.0.0.0:80
proxy_address_tls: 0.0.0.0:443
proxy_configs: /etc/aralez
proxy_tls_grade: high
upstreams_conf: /etc/aralez/upstreams.yml
log_level: info
hc_method: HEAD
hc_interval: 2
```

**upstreams.yml example:**

```yaml
provider: "kubernetes"
to_https: false
sticky_sessions: 86000
rate_limit: 100
x4xx_limit: 100
headers:
  - "Access-Control-Allow-Origin:*"
  - "Access-Control-Allow-Methods:POST, GET, OPTIONS"
  - "Access-Control-Max-Age:86400"
  - "Strict-Transport-Security:max-age=31536000; includeSubDomains; preload"
kubernetes:
  services:
    - hostname: "webapi-service"
      path: "/"
      upstream: "webapi-service"
    - hostname: "webapi-service"
      upstream: "console-service"
      path: "/one"
      headers:
        - "X-Some-Thing:Yaaaaaaaaaaaaaaa"
        - "X-Proxy-From:Aralez"
      rate_limit: 50
      to_https: false
    - hostname: "webapi-service"
      upstream: "rambulik-service"
      path: "/two"
    - hostname: "websocket-service"
      upstream: "websocket-service"
      path: "/"
  tokenpath: "/var/run/secrets/kubernetes.io/serviceaccount/token"
```

**Apply ConfigMaps:**

```shell
kubectl -n staging create configmap aralez-main-config --from-file=main.yaml=./main.yaml
kubectl -n staging create configmap aralez-upstreams-config --from-file=upstreams.yml=./upstreams.yaml
```

---

### TLS Certificate Secret

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: aralez-tls
type: kubernetes.io/tls
data:
  tls.crt: <base64-cert>
  tls.key: <base64-key>
```

---

### Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: aralez
spec:
  replicas: 1
  selector:
    matchLabels:
      app: aralez
  template:
    metadata:
      labels:
        app: aralez
    spec:
      serviceAccountName: aralez-sa
      containers:
        - name: aralez
          image: sadoyan/aralez:latest
          ports:
            - containerPort: 80
            - containerPort: 443
          volumeMounts:
            - name: main-config
              mountPath: /etc/aralez/main.yaml
              subPath: main.yaml
              readOnly: true
            - name: upstreams-config
              mountPath: /etc/aralez/config/upstreams.yml
              subPath: upstreams.yml
              readOnly: true
            - name: tls-certs
              mountPath: /etc/aralez/certs
              readOnly: true
      volumes:
        - name: main-config
          configMap:
            name: aralez-main-config
        - name: upstreams-config
          configMap:
            name: aralez-upstreams-config
        - name: tls-certs
          secret:
            secretName: aralez-tls
```

---

### Service

```yaml
apiVersion: v1
kind: Service
metadata:
  name: aralez-service
spec:
  type: NodePort
  selector:
    app: aralez
  ports:
    - name: http
      port: 80
      targetPort: 80
    - name: https
      port: 443
      targetPort: 443
```

---

## Step 4: Expose Aralez

**ClusterIP (internal access only):**

```yaml
apiVersion: v1
kind: Service
metadata:
  name: aralez
  namespace: default
spec:
  selector:
    app: aralez
  ports:
    - port: 80
      targetPort: 80
```

**NodePort or LoadBalancer (external access):**

```yaml
spec:
  type: NodePort   # Use LoadBalancer if running in a cloud environment
```

---

Aralez is now running inside your Kubernetes cluster with the right permissions and is accessible through a Kubernetes Service.
