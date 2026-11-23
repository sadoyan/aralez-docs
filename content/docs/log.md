---
title: "Logging Configuration"
description: "Reference for logging, access logs, custom patterns, file rotation, and structured Elasticsearch sinks"
weight: 3
---

## Overview

Aralez provides flexible logging controls supporting standard error output, file-based rotation, custom date/format patterns, access logging, and bulk-shipped structured logs to
Elasticsearch.

---

## `main.yaml` Logging Parameters

| Key                    | Example Value                                     | Description                                                                                            |
|:-----------------------|:--------------------------------------------------|:-------------------------------------------------------------------------------------------------------|
| **log**                | Optional Block                                    | If omitted logs to stdout.                                                                             |
| **log.log_level**      | `info`                                            | Global logging verbosity threshold (`info`, `warn`, `error`, `debug`, `trace`, `off`).                 |
| **log.access_log**     | `all`                                             | Access logging mode (`all`, `error`). Omit or comment out to disable.                                  |
| **log.log_pattern**    | `{d(%Y-%m-%d %H:%M:%S)} {h({l})} - {t} - {m} {n}` | Optional custom log pattern. Defaults to `{d(%Y-%m-%d %H:%M:%S)} {l} - {m}{n}`.                        |
| **log.log_file**       | `/tmp/aralez.log, 20, 5, compress`                | Optional file logging config: file path, max size (MB), rotated files to keep, and compression toggle. |
| **log.log_structured** | Disabled by default                               | Optional structured logging sink target (e.g., `elasticsearch\otel`).                                  |

### Example

```yaml
log:
  level: info
  access: all
  pattern: "{d(%Y-%m-%d %H:%M:%S)} {h({l})} - {t} - {m} {n}"
  file: /tmp/aralez.log, 20, 5, compress
  remote: otel 
```

## Log Output Modes

* **Standard Output (Stdout):** If no file logging or `error_log` parameters are configured, Aralez automatically directs logs to standard output.
* **Access Logging:** When enabled via `access_log: all`, every processed request logs its HTTP status code, result (`hit`/`miss`), request path, Virtual Host (`Host` header), client
  IP, protocol version, and User-Agent.

---

## Structured Logging (Elasticsearch)

To enable structured bulk logging to Elasticsearch, configure the following parameter in `main.yaml`:

```yaml
log:
  remote: "elasticsearch"
```

**Required Environment Variables**

- `LOG_ELASTIC_HOSTS`: URLs of Elasticsearch seed hosts used to construct the internal bulk client.
- `LOG_ELASTIC_USER`: Username for Elasticsearch HTTP authentication.
- `LOG_ELASTIC_PASSWORD`: Password for Elasticsearch HTTP authentication.
- `LOG_ELASTIC_INDEX`: Target Elasticsearch index name for log ingestion.
- `LOG_ELASTIC_FLUSH_DURATION`: Time window (in seconds) to buffer logs in memory before flushing.
- `LOG_ELASTIC_BATCH_LEN`: Maximum batch message count held in memory before triggering a bulk index flush.

The followings are example environment variables configuration defaults:

```shell
export LOG_ELASTIC_HOSTS=http://127.0.0.1:9200 
export LOG_ELASTIC_USER=elastic
export LOG_ELASTIC_PASSWORD=elastic
export LOG_ELASTIC_INDEX=aralez-logs
export LOG_ELASTIC_FLUSH_DURATION=2 
export LOG_ELASTIC_BATCH_LEN=200 
```

## Structured Logging (OpenTelemetry)

To enable structured bulk logging to OpenTelemetry Collector, configure the following parameter in `main.yaml`:

```yaml
log:
  remote: "otel"
```

**Required Environment Variables**

- `LOG_OTEL_GRPC_HOST`: URLs of OpenTelemetry gRPC host:port.
- `LOG_OTEL_HTTP_HOST`: URLs of OpenTelemetry HTTP host:port.
- `LOG_OTEL_PROTOCOL`: OpenTelemetry Collector protocol `grpc|http`.
- `LOG_OTEL_DELAY`: Time window (in milliseconds) to buffer logs in memory before flushing.
- `LOG_OTEL_BATCH_SIZE`: Number of message to buffer in memory before flushing.
- `LOG_OTEL_HEADERS`: Optionally authentication headers if OpenTelemetry Collector requires authentication.
    - example : `"authorization=Bearer 1H7TA4a7GCDqfXM2kAW1bz3OSxyPaHJw4xMlLWYWsP6ih1ZuYq"`

The followings are example environment variables configuration defaults, except `LOG_OTEL_HEADERS`, default it's not set: disabled.

```shell
export LOG_OTEL_GRPC_HOST=http://127.0.0.1:4318
export LOG_OTEL_PROTOCOL=grpc
export LOG_OTEL_DELAY=2000
export LOG_OTEL_BATCH_SIZE=512
export LOG_OTEL_HEADERS="authorization=Bearer 1H7TA4a7GCDqfXM2kAW1bz3OSxyPaHJw4xMlLWYWsP6ih1ZuYq"
```

## Writing a Custom Logging Module

**Overview**

Aralez features a modular, decoupled logging architecture powered by asynchronous message-passing (mpsc channels) and the inventory crate for compile-time plugin registration.

This guide walks through how to implement a custom logging backend (such as shipping logs to a custom sink, database, or external API) by writing a plugin that conforms to the WriteLog
trait.

**Architectural Pattern**

- Decoupled Workloads: Application and access logs are pushed into a Tokio multi-producer, single-consumer (mpsc) channel, ensuring that slow logging sinks never block the proxy's
  high-performance request hot path.
- Trait Implementation: Your custom struct implements the WriteLog trait via #[async_trait], listening asynchronously for incoming StructuredSystemLog messages.
- Inventory Registration: The inventory::submit! macro registers your plugin at compile time, making it dynamically available to the Aralez core engine without modifying core routing
  logic.

**Code Example**

Here is a fully functional reference implementation of a custom logging module.

```rust
use crate::logging::core::StructuredSystemLog;
use crate::logging::types::{LogBackendPlugin, WriteLog};
use async_trait::async_trait;
use tokio::sync::mpsc;

pub struct Example;

#[async_trait]
impl WriteLog for Example {
    async fn run(&self, mut rx: mpsc::Receiver<StructuredSystemLog>) {
        while let Some(msg) = rx.recv().await {
            println!("Sending log Example : {:?}", msg);
        }
    }
}

inventory::submit! {
    LogBackendPlugin {
        name: "example",
        factory: || Box::new(Example),
    }
}
```

Replace `println!("Sending log Example : {:?}", msg);` with your logic.

**Step-by-Step Implementation Guide**

1. Define the Plugin Struct
   Create a unit struct or stateful struct (e.g., pub struct Example;) that will represent your logging backend handler.

2. Implement the WriteLog Trait Annotate your implementation block with #[async_trait] and define the run method.
    - The rx receiver is a Tokio mpsc::Receiver<StructuredSystemLog> channel.
    - Use a while let Some(msg) = rx.recv().await loop to process log messages as they arrive asynchronously.
3. Register via inventory::submit! Expose your plugin to the Aralez runtime by submitting a LogBackendPlugin description:
    - name: The string identifier users will reference in their configuration (e.g., "example").
    - factory: A closure returning a boxed instance of your struct (Box::new(Example)).

**Activating Your Custom Module**

Once compiled into the binary, you can select and enable your custom logging backend in your configuration or initialization flow just like built-in sinks.