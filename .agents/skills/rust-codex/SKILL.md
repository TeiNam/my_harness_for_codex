---
name: rust-codex
description: Use for Rust coding, cargo tests, ownership errors, traits, async Rust, CLI tools, or Rust performance and safety fixes.
---

# Rust Codex

Make the compiler do the work.

1. Inspect `Cargo.toml`, workspace layout, feature flags, and existing error types before editing.
2. Prefer `Result` propagation with existing error conventions. Do not introduce a new error crate unless one is already used.
3. Use iterators, pattern matching, and small functions where they reduce code; avoid clever lifetime gymnastics when ownership can be simplified.
4. Keep `unsafe` out unless the task is explicitly about FFI or low-level performance and existing code already justifies it.
5. Preserve public APIs and feature flags unless the user asks for breaking changes.
6. Add or update one focused test for non-trivial behavior.
7. Run `cargo test` for the narrowest package or test target first; run broader checks only when touched code crosses crates.

Prefer deleting generic traits/macros when there is one implementation.
