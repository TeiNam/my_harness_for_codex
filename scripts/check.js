#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const required = [
  "AGENTS.md",
  "LICENSE",
  "README.md",
  ".codex/config.toml",
  ".agents/plugins/marketplace.json",
  "plugins/codex-programming-harness/.codex-plugin/plugin.json",
  ".agents/skills/codex-implementation-loop/SKILL.md",
  ".agents/skills/codex-debug-fix/SKILL.md",
  ".agents/skills/codex-review/SKILL.md",
  ".agents/skills/codex-harness-maintenance/SKILL.md",
  ".agents/skills/python-codex/SKILL.md",
  ".agents/skills/typescript-react-codex/SKILL.md",
  ".agents/skills/rust-codex/SKILL.md",
  ".agents/skills/database-codex/SKILL.md",
  ".agents/skills/frontend-qa-codex/SKILL.md",
];

let failed = false;

for (const rel of required) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) {
    console.error(`missing: ${rel}`);
    failed = true;
  }
}

function checkSkills(relDir) {
  const skillDir = path.join(root, relDir);
  for (const name of fs.readdirSync(skillDir)) {
    const file = path.join(skillDir, name, "SKILL.md");
    const text = fs.readFileSync(file, "utf8");
    if (!/^---\n[\s\S]*\n---\n/.test(text)) {
      console.error(`missing frontmatter: ${path.relative(root, file)}`);
      failed = true;
    }
    if (!/^name: .+$/m.test(text) || !/^description: .+$/m.test(text)) {
      console.error(`missing name/description: ${path.relative(root, file)}`);
      failed = true;
    }
  }
}

checkSkills(path.join(".agents", "skills"));
checkSkills(path.join("plugins", "codex-programming-harness", "skills"));

const manifest = JSON.parse(
  fs.readFileSync(
    path.join(root, "plugins", "codex-programming-harness", ".codex-plugin", "plugin.json"),
    "utf8",
  ),
);
if (manifest.name !== "codex-programming-harness") {
  console.error("plugin manifest name mismatch");
  failed = true;
}
if (!/^\d+\.\d+\.\d+$/.test(manifest.version || "")) {
  console.error("plugin manifest version must be semver");
  failed = true;
}
if (manifest.skills !== "./skills/") {
  console.error("plugin manifest skills must be ./skills/");
  failed = true;
}
for (const field of [
  "displayName",
  "shortDescription",
  "longDescription",
  "developerName",
  "category",
]) {
  if (typeof manifest.interface?.[field] !== "string" || !manifest.interface[field].trim()) {
    console.error(`missing plugin interface field: ${field}`);
    failed = true;
  }
}
if (!Array.isArray(manifest.interface?.capabilities)) {
  console.error("plugin interface capabilities must be an array");
  failed = true;
}
if (!Array.isArray(manifest.interface?.defaultPrompt)) {
  console.error("plugin interface defaultPrompt must be an array");
  failed = true;
}

const marketplace = JSON.parse(
  fs.readFileSync(path.join(root, ".agents", "plugins", "marketplace.json"), "utf8"),
);
const pluginEntry = marketplace.plugins?.find(
  (plugin) => plugin.name === "codex-programming-harness",
);
if (!pluginEntry) {
  console.error("missing marketplace entry: codex-programming-harness");
  failed = true;
}
if (pluginEntry?.source?.path !== "./plugins/codex-programming-harness") {
  console.error("marketplace source path mismatch");
  failed = true;
}
if (pluginEntry?.policy?.installation !== "AVAILABLE") {
  console.error("marketplace installation policy mismatch");
  failed = true;
}
if (pluginEntry?.policy?.authentication !== "ON_INSTALL") {
  console.error("marketplace authentication policy mismatch");
  failed = true;
}

const repoSkills = path.join(root, ".agents", "skills");
const pluginSkills = path.join(root, "plugins", "codex-programming-harness", "skills");
for (const name of fs.readdirSync(repoSkills)) {
  const repoFile = path.join(repoSkills, name, "SKILL.md");
  const pluginFile = path.join(pluginSkills, name, "SKILL.md");
  if (!fs.existsSync(pluginFile)) {
    console.error(`plugin missing copied skill: ${name}`);
    failed = true;
    continue;
  }
  if (fs.readFileSync(repoFile, "utf8") !== fs.readFileSync(pluginFile, "utf8")) {
    console.error(`plugin skill out of sync: ${name}`);
    failed = true;
  }
}

if (failed) process.exit(1);
console.log("harness check passed");
