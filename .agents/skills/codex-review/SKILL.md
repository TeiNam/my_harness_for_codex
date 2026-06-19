---
name: codex-review
description: Use for code review, PR review, diff review, or asking whether a change is correct. Prioritizes serious defects and over-engineering.
---

# Codex Review

Review like a maintainer who has to own the code.

Order findings by severity:

1. data loss, security, auth, money, concurrency, migration risk
2. behavioral regressions and broken edge cases
3. missing tests for changed behavior
4. unnecessary complexity that can be deleted

For each finding, include:

- file and line when available
- concrete failure mode
- minimal fix direction

Skip style-only comments unless they hide a bug. If no serious issues are found, say so and name any residual test gap.
