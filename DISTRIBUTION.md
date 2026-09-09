# Distribution

This repo ships a local Codex marketplace and one self-contained plugin.

## Plugin

- Name: `codex-programming-harness`
- Path: `plugins/codex-programming-harness`
- Manifest: `plugins/codex-programming-harness/.codex-plugin/plugin.json`
- Skills: `plugins/codex-programming-harness/skills`

## Marketplace

- Path: `.agents/plugins/marketplace.json`
- Name: `codex-harnesses`
- Entry path: `./plugins/codex-programming-harness`

## GitHub install

After pushing this repo to GitHub, add it as a Codex marketplace source:

```bash
codex plugin marketplace add TeiNam/my_harness_for_codex --ref main
```

Or use the HTTPS Git URL:

```bash
codex plugin marketplace add https://github.com/TeiNam/my_harness_for_codex.git --ref main
```

Then install `codex-programming-harness` from the Codex plugin UI.

## Local test

From the repo root:

```bash
codex plugin marketplace add .
```

## Updating

When repo skills change, copy each entire skill directory into the plugin skills folder, including references, scripts, and assets. Remove retired files from both locations and keep the root `LICENSE` copied to the plugin root. Then run:

```bash
node scripts/check.js
```

The checker compares the full skill trees and license notices; it also checks linked references in each `SKILL.md`. If the checker changes, run `node scripts/check.test.js`.

If you have Codex's `plugin-creator` skill installed locally, you can also run its `validate_plugin.py` against `plugins/codex-programming-harness`.

Keep the plugin self-contained. Do not rely on `.agents/skills` at runtime after installation.
