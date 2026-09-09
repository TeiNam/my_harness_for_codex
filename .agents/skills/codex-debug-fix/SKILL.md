---
name: codex-debug-fix
description: Use when the user provides an error, failing test, CI failure, traceback, build log, or asks Codex to find and fix a bug.
---

# Codex Debug Fix

Debug by shrinking the problem before changing code.

1. Identify the exact failing command, error line, and expected behavior.
2. Reproduce locally when feasible. If reproduction is expensive, inspect the narrowest source path first.
3. Find the owner boundary: test, implementation, config, dependency, environment. Search every caller of the code being changed and trace the failing flow before choosing the fix.
4. Change one cause, not the surrounding architecture.
5. Add or update one regression check when the bug is non-trivial.
6. Re-run the failing command, then the smallest adjacent check.

For stateful UI bugs, trace ordered calls and their final state, including resets and async completions. A handler can run successfully while a later call undoes its work.

Use the current session's permissions and existing authorization. If reproducing the failure needs additional access, request only that access and explain the concrete requirement.
