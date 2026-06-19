---
name: codex-debug-fix
description: Use when the user provides an error, failing test, CI failure, traceback, build log, or asks Codex to find and fix a bug.
---

# Codex Debug Fix

Debug by shrinking the problem before changing code.

1. Identify the exact failing command, error line, and expected behavior.
2. Reproduce locally when feasible. If reproduction is expensive, inspect the narrowest source path first.
3. Find the owner boundary: test, implementation, config, dependency, environment.
4. Change one cause, not the surrounding architecture.
5. Add or update one regression check when the bug is non-trivial.
6. Re-run the failing command, then the smallest adjacent check.

If the failure needs network, credentials, or writes outside the workspace, request the narrowest approval and explain why.
