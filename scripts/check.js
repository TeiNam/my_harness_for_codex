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
  "plugins/codex-programming-harness/LICENSE",
  ".agents/skills/codex-implementation-loop/SKILL.md",
  ".agents/skills/codex-debug-fix/SKILL.md",
  ".agents/skills/codex-review/SKILL.md",
  ".agents/skills/codex-harness-maintenance/SKILL.md",
  ".agents/skills/python-codex/SKILL.md",
  ".agents/skills/typescript-react-codex/SKILL.md",
  ".agents/skills/rust-codex/SKILL.md",
  ".agents/skills/database-codex/SKILL.md",
  ".agents/skills/frontend-qa-codex/SKILL.md",
  ".agents/skills/codebase-onboarding-codex/SKILL.md",
  ".agents/skills/security-review-codex/SKILL.md",
  ".agents/skills/deployment-codex/SKILL.md",
  ".agents/skills/benchmark-codex/SKILL.md",
  ".agents/skills/technical-writing-codex/SKILL.md",
  ".agents/skills/data-analysis-codex/SKILL.md",
];

let failed = false;

for (const rel of required) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) {
    console.error(`missing: ${rel}`);
    failed = true;
  }
}

if (failed) process.exit(1);

function checkSkills(relDir) {
  const skillDir = path.join(root, relDir);
  for (const name of fs.readdirSync(skillDir)) {
    const file = path.join(skillDir, name, "SKILL.md");
    if (!fs.existsSync(file)) {
      console.error(`missing: ${path.relative(root, file)}`);
      failed = true;
      continue;
    }
    const text = fs.readFileSync(file, "utf8");
    const frontmatter = text.match(/^---\n([\s\S]*?)\n---\n/)?.[1] || "";
    if (!frontmatter) {
      console.error(`missing frontmatter: ${path.relative(root, file)}`);
      failed = true;
    }
    if (!/^name: .+$/m.test(frontmatter) || !/^description: .+$/m.test(frontmatter)) {
      console.error(`missing name/description: ${path.relative(root, file)}`);
      failed = true;
    }
    for (const [, reference] of text.matchAll(/\[[^\]]*\]\((references\/[^)#\s]+)(?:#[^)\s]+)?\)/g)) {
      if (!fs.existsSync(path.join(skillDir, name, reference))) {
        console.error(`missing skill reference: ${path.relative(root, file)} -> ${reference}`);
        failed = true;
      }
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

function filesUnder(dir, prefix = "") {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const rel = path.join(prefix, entry.name);
    return entry.isDirectory() ? filesUnder(path.join(dir, entry.name), rel) : [rel];
  });
}

const repoFiles = new Set(filesUnder(repoSkills));
const pluginFiles = new Set(filesUnder(pluginSkills));
for (const rel of new Set([...repoFiles, ...pluginFiles])) {
  if (!repoFiles.has(rel) || !pluginFiles.has(rel)) {
    console.error(`skill file missing from ${repoFiles.has(rel) ? "plugin" : "repo"}: ${rel}`);
    failed = true;
    continue;
  }
  if (!fs.readFileSync(path.join(repoSkills, rel)).equals(fs.readFileSync(path.join(pluginSkills, rel)))) {
    console.error(`plugin skill out of sync: ${rel}`);
    failed = true;
  }
}

if (!fs.readFileSync(path.join(root, "LICENSE")).equals(
  fs.readFileSync(path.join(root, "plugins/codex-programming-harness/LICENSE")),
)) {
  console.error("plugin license out of sync");
  failed = true;
}

if (failed) process.exit(1);
console.log("harness check passed");
