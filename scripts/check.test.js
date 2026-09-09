#!/usr/bin/env node
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const temp = fs.mkdtempSync(path.join(os.tmpdir(), "codex-harness-check-"));
const repoReference = ".agents/skills/python-codex/references/fastapi.md";
const pluginReference = "plugins/codex-programming-harness/skills/python-codex/references/fastapi.md";
const pluginLicense = "plugins/codex-programming-harness/LICENSE";

function check(status, message) {
  const result = spawnSync(process.execPath, [path.join(temp, "scripts/check.js")], { encoding: "utf8" });
  assert.ifError(result.error);
  assert.equal(result.status, status, result.stderr);
  assert.ok((result.stdout + result.stderr).includes(message), result.stdout + result.stderr);
}

try {
  for (const rel of ["AGENTS.md", "LICENSE", "README.md", ".codex", ".agents", "plugins", "scripts/check.js"]) {
    fs.mkdirSync(path.dirname(path.join(temp, rel)), { recursive: true });
    fs.cpSync(path.join(root, rel), path.join(temp, rel), { recursive: true });
  }
  check(0, "harness check passed");

  fs.appendFileSync(path.join(temp, pluginReference), "\nChanged reference.\n");
  check(1, "plugin skill out of sync");
  fs.copyFileSync(path.join(root, pluginReference), path.join(temp, pluginReference));

  fs.unlinkSync(path.join(temp, pluginReference));
  check(1, "skill file missing from plugin");
  fs.unlinkSync(path.join(temp, repoReference));
  check(1, "missing skill reference");
  for (const rel of [repoReference, pluginReference]) {
    fs.copyFileSync(path.join(root, rel), path.join(temp, rel));
  }

  const stale = path.join(temp, "plugins/codex-programming-harness/skills/python-codex/references/stale.md");
  fs.writeFileSync(stale, "Retired reference.\n");
  check(1, "skill file missing from repo");
  fs.unlinkSync(stale);

  fs.appendFileSync(path.join(temp, pluginLicense), "\nChanged notice.\n");
  check(1, "plugin license out of sync");
  fs.copyFileSync(path.join(root, pluginLicense), path.join(temp, pluginLicense));
  check(0, "harness check passed");
  console.log("harness checker regression checks passed");
} finally {
  fs.rmSync(temp, { recursive: true, force: true });
}
