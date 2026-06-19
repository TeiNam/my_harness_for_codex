---
name: codex-implementation-loop
description: Use for programming tasks that ask Codex to implement, refactor, or modify code in a repository. Optimized for small diffs, local context, and verification.
---

# Codex Implementation Loop

Use the shortest path that produces a correct, verified change.

1. Restate the task internally as `Goal`, `Context`, `Constraints`, and `Done when`.
2. Read only the files needed to understand the current pattern. Use `rg` first.
3. Prefer deletion, stdlib, and existing local helpers before adding code or dependencies.
4. Make the narrowest edit that satisfies the task.
5. Run the smallest relevant check first. Escalate to broader checks only when the touched surface warrants it.
6. Report what changed, what check ran, and any known gap.

Avoid:

- speculative abstractions
- broad rewrites
- new dependencies for small local logic
- copying Claude Code command/agent patterns into Codex without a Codex surface that uses them
