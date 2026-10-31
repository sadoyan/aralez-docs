---
title: "Cache"
description: "Types and configuration"
weight: 2
---

Caching is disabled if the `cache:` block is commented out or omitted. Aralez supports three storage backends:

- **`memory`**: Content is stored entirely in local RAM.
  - **Performance:** Blazing fast with the lowest possible latency.
  - **Persistence:** Ephemeral; data does not survive process restarts.
  - **Use Case:** Ideal for single-instance setups requiring maximum speed and zero storage configuration overhead.
- **`hybrid`**: Content is tiered between local RAM and the local file system.
  - **Capacity:** Allows cache sizes significantly larger than available physical RAM.
  - **Tier Management:** Hot and cold items are dynamically balanced across memory and disk.
  - **Persistence:** Memory states are periodically flushed to disk. Only flushed data survives restarts; any changes made after the last flush will be lost.
  - **Disk Behavior:** Expired data is lazily overwritten rather than actively purged, meaning the file system storage will quickly grow to its maximum configured capacity and remain stable at that size.
  - **Use Case:** Ideal for datasets larger than available RAM that require high-capacity local storage and persistence across restarts without an external Redis cluster.
- **`redis`**: Uses external RESP-compatible servers (e.g., Redis, Valkey, Dragonfly, KeyDB) as a centralized cache storage layer.
  - **Architecture:** Requires an accessible external RESP-compliant cluster or instance.
  - **Persistence:** Handled externally by the database layer.
  - **Use Case:** Essential for horizontal scaling where multiple Aralez proxy instances need to share a unified cache pool.
- **`tikv`** Uses a distributed transactional and raw key-value store (TiKV) backed by Placement Driver (PD) endpoints as a centralized, highly scalable cache storage layer.
  - **Architecture:** Requires an accessible external TiKV cluster with list of or single PD endpoints (e.g., tikv://127.0.0.1:2379,127.0.0.2:2379).
  - **Capacity:** Horizontally scalable and distributed, allowing massive cache capacities far beyond single-node RAM or disk and Redis limits.
  - **Persistence:** Handled externally and reliably by the distributed TiKV cluster storage engine.
  - **Requires:** Externally running TiKV cluster with enabled **TTL**. 
    - **TTL** must be enabled on TiKV cluster otherwise cache will fail to write data. [**How to enable TTL on TiKV**](https://tikv.org/docs/5.1/concepts/explore-tikv-features/ttl/):
  - **Use Case:** Ideal for distributed, high-availability deployments where multiple Aralez proxy instances require a fault-tolerant, and horizontally scalable unified cache pool.


Controlled by :

- `cache:` Block to enable/disabe cache entirely. Removal of block will entirely cache
- `cache.mem_size_mb` Set the size in MB for in memory cache, for `memory` or `hybrid` storage.
- `cache.file_size_mb` Set the size in MB for in disk storage, for `hybrid` storage only.
- `cache.ttl` Set TTL to cached items, respected by all storage backends. Required for all storage backends.
- `cache.storage` Storage backend: `memory`, `hybrid`, `redis://host:port` or `tikv://host1:port,host2:port`. Defaults to `memory`.
- `cache.flush_interval` Interval in seconds to flush memory to disk. For `hybrid` mode only.
- `cache.item_max_size` Maximum allowed size for a single cached item in megabytes. Do not set to more than 10-15Mb

Only **GET** requests with **2xx** responses will be cached honoring `Cache-Control` headers, `Content-Length` header is required.
Content without this header won't be cached or the size bigger than `cache_item_max_size` won't be cached.

```ini
Cache-Control max-age = 300;
Cache-Control s-maxage = 600;
Cache-Control no-store;
Cache-Control private;
```