---
name: codebase-onboarding-codex
description: Explain an unfamiliar repository, trace its architecture and entry points, or create project-specific AGENTS.md guidance when requested.
---

# Codebase Onboarding

Build an evidence-based map that tells the user where to make their next change.

1. Read existing `AGENTS.md`, the README, manifests, lockfiles, and CI entry points. Use `rg --files` to locate source and tests; skip generated and vendored trees.
2. Confirm the stack from code and manifests. Distinguish declared versions from versions actually installed.
3. Trace one representative request, command, or job from entry through validation, business logic, storage, and output. Name the files involved.
4. Identify the existing error, configuration, testing, and migration conventions from examples in the repository.
5. Return the purpose, a small directory map, the traced flow, supported development commands, and where a likely change belongs. Mark commands as inspected or executed.

Create or update `AGENTS.md` only when project setup or durable guidance is part of the request. Preserve existing instructions and add only verified commands and non-obvious project constraints. Put an extended architecture explanation in the requested documentation, not in always-loaded instructions.

Do not infer architecture solely from folder names, install dependencies just to identify the stack, or create an onboarding file when a conversational explanation satisfies the request.
