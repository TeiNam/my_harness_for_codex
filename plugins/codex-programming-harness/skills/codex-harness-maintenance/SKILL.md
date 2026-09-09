---
name: codex-harness-maintenance
description: Use when editing this Codex harness, adding skills, changing AGENTS.md, tuning config, or translating Claude Code harness assets into Codex-native equivalents.
---

# Codex Harness Maintenance

Keep this harness small and Codex-native.

Default decision ladder:

1. `AGENTS.md` for durable repo behavior.
2. `.agents/skills/<name>/SKILL.md` for repeatable workflows.
3. `.codex/config.toml` for sandbox, approval, MCP, hooks, model, and feature defaults.
4. hooks only for mechanical enforcement around tool calls or lifecycle events.
5. plugin only when distribution, marketplace install, bundled MCP, or bundled hooks are needed.

When porting from Claude Code:

- Convert `CLAUDE.md` guidance into `AGENTS.md` only if it should always apply.
- Convert slash commands into skills only when the workflow is reusable.
- Do not port Claude subagents one-for-one. Codex subagents should be added only for noisy, specialized delegation.
- Do not port hooks until a rule must be mechanically enforced.
- Merge overlapping guidance into an existing skill. Put substantial conditional detail in linked references and preserve source license notices.
- Replace source-specific tool names and paths with capabilities available in the target session; verify version-dependent instructions against official documentation.

In this harness repository, mirror each skill's entire directory into the existing plugin package, including references and assets. Keep the package license notices in sync.

Run `node scripts/check.js` after changing harness structure. Run `node scripts/check.test.js` when changing the checker itself.
