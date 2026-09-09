---
name: typescript-react-codex
description: Use for TypeScript, React, Vite, frontend state, components, hooks, forms, browser UI fixes, or Obsidian plugin UI work.
---

# TypeScript React Codex

Keep UI code predictable and typed at the boundary.

1. Check `package.json` scripts and existing component/style patterns first.
2. Use platform features before libraries: native forms, CSS layout, `URL`, `Intl`, `AbortController`, `localStorage` when appropriate.
3. Keep state local until it is demonstrably shared. Do not add global state for one component.
4. Type external data and component props. Do not hide uncertainty with broad `any`.
5. For React, avoid effects for pure derivations; compute during render or memoize only when there is actual cost.
6. Preserve accessibility basics: labels, buttons for actions, links for navigation, keyboard-visible controls.
7. Verify with the project's smallest script: typecheck, lint, unit test, or targeted browser check.

Avoid styling rewrites, design-system invention, and new dependencies unless the existing stack already uses them.

For Vite configuration or environment changes, read [Vite boundaries](references/vite.md). For Obsidian lifecycle, vault, settings, or release work, read [Obsidian boundaries](references/obsidian.md). Do not load either reference for unrelated React changes.
