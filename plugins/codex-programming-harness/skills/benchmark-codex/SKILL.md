---
name: benchmark-codex
description: Measure a reported slowdown, compare performance before and after a change, or evaluate alternatives using a reproducible workload.
---

# Benchmark

Measure the same work under comparable conditions before claiming an improvement.

1. Define the workload and success metric: latency, throughput, memory, bundle size, or build time. Record the revision, command, input, runtime, and environment.
2. Reuse an existing benchmark. Otherwise use the smallest suitable tool, such as `time`, Python `timeit`, or the project's profiler.
3. Separate cold start from warmed runs. Repeat enough to expose noise; keep inputs, concurrency, caches, and background load comparable.
4. Compare a baseline and candidate without resetting or stashing user changes. Use the workspace manager's isolation tools when present, or a separate checkout when needed.
5. Verify output correctness and count failures. Faster failures or reduced work are not performance gains.
6. Report sample count, a representative statistic and spread, absolute and relative change, and limitations. For tail percentiles, collect enough observations to support the claim; do not infer production tail latency from a handful of requests.

Use measured bottlenecks to choose the next change. Keep raw results or a rerunnable command with the requested artifact; create a persistent benchmark suite only when the task needs it.

Browser lab measurements and field metrics answer different questions. State which was measured and use the project's targets rather than inventing universal budgets.

Run load against a local or explicitly authorized environment, with bounded concurrency and duration. A timing request does not authorize load on production or paid third-party services.
