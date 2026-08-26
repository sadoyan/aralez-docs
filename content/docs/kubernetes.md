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
kind: ClusterRole
metadata:
  name: aralez-role
rules:
  - apiGroups: ["networking.k8s.io"]
    resources: ["ingresses", "ingressclasses"]
    verbs: ["get", "list", "watch"]
  - apiGroups: ["networking.k8s.io"]
    resources: ["ingresses/status"]
    verbs: ["get", "update", "patch"]
  - apiGroups: [""]
    resources: ["endpoints", "secrets", "services"]
    verbs: ["get", "list", "watch"]
  - apiGroups: [""]
    resources: ["nodes"]
    verbs: ["get", "list"]
```

**ClusterRole (scoped to a single namespace):**

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: aralez-ingress
subjects:
  - kind: ServiceAccount
    name: aralez-sa
    namespace: default
roleRef:
  kind: ClusterRole
  name: aralez-role
  apiGroup: rbac.authorization.k8s.io
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
# The file under watch and hot reload, changes are applied immediately, no need to restart or reload.
provider: "kubernetes" # "file" "consul" "kubernetes"
sticky_sessions: 172000
to_https: false
rate_limit: 500000
x4xx_limit: 100000
server_headers:
  - "X-Forwarded-Proto:https"
  - "X-Forwarded-Port:443"
client_headers:
  - "X-Global-Client:Yooooooo"
kubernetes:
  servers:
    - "127.0.0.1:6443" # Gets KUBERNETES_SERVICE_HOST : KUBERNETES_SERVICE_PORT_HTTPS env variables.
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
              mountPath: /etc/aralez/upstreams.yml
              subPath: upstreams.yml
              readOnly: true
            - name: tls-certs
              mountPath: /etc/aralez/certificates
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

### Example webserver from Nginx which will be load balanced via Aralez

**1. Define the IngressClass so Kubernetes knows "aralez" is a valid controller**
```yaml
apiVersion: networking.k8s.io/v1
kind: IngressClass
metadata:
  name: aralez
spec:
  controller: aralez.proxy/ingress-controller
```
**2. Example Nginx service**
```yaml
apiVersion: v1
kind: Service
metadata:
  name: svc-nginx
spec:
  selector:
    app: svc-nginx
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
```
**3  Define your Ingress resource targeting Aralez**
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: wss-service-v2
  namespace: default
  annotations:
    # These custom annotations are parsed by Aralez
    aralez.rs/rate_limit: "50"
    aralez.rs/x4xx_limit: "10"
    aralez.rs/client_headers: '["X-Some-Client:Some Custom Header", "X-Example-Client:An Example Header"]'
    aralez.rs/server_headers: '["X-Some-Server:Some Custom Header", "X-Example-Server:An Example Header"]'
spec:
  ingressClassName: aralez  # Matches the IngressClass metadata
  rules:
    - host: wss-service-v2.blabla.com
      http:
        paths:
          - path: /ws
            pathType: Prefix
            backend:
              service:
                name: svc-nginx
                port:
                  number: 80
```
**4  Deploy Nginx**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: svc-nginx
  labels:
    app: svc-nginx
spec:
  selector:
    matchLabels:
      app: svc-nginx
  replicas: 3
  template:
    metadata:
      labels:
        app: svc-nginx
    spec:
      containers:
      - name: svc-nginx
        image: nginx:latest
        ports:
        - containerPort: 80
```
---
Aralez is now running inside your Kubernetes cluster with the right permissions and is accessible through a Kubernetes Service.
Ity will get from Kubernetes API service all matchings with `ingressClassName`, internally construct the routing logic and expose ports.
`hosts` matching `wss-service-v2.blabla.com` will be routed to pods of `svc-nginx` service, additional settings from `annotations:` will be applied.  

Here are all [**Example YAML**](https://github.com/sadoyan/aralez/tree/main/etc/kubernetes): files 
