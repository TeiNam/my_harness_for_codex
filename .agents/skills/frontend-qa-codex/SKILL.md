---
name: frontend-qa-codex
description: Use when a frontend change needs visual verification, Playwright/browser testing, responsive checks, accessibility smoke tests, or dev-server validation.
---

# Frontend QA Codex

Verify the actual UI when the change is visual or interactive.

1. Find the project's dev command and preferred port from `package.json` or docs.
2. Start a dev server only when the app needs one; reuse an existing server if available.
3. Check at least one desktop and one mobile viewport for layout changes.
4. For canvas, WebGL, animation, or 3D, confirm nonblank pixels and correct framing, not just DOM presence.
5. For forms and controls, click/type through the changed workflow.
6. Capture the smallest useful evidence: failing output, screenshot path, or command result summary.

Do not add Playwright or browser tooling if the project does not already use it and a simpler check is enough.
