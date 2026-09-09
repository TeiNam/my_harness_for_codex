# Obsidian Boundaries

Check the installed Obsidian API types and the plugin's minimum app version before choosing an API. Verify current submission requirements only when release work is requested.

- Use the plugin's app instance and supported vault/editor APIs. Normalize and validate user-supplied paths; do not overwrite a note while an editor or another action has newer content.
- Prefer the supported atomic content or frontmatter update API for the installed version over a separate read/modify/write sequence.
- Register events, DOM listeners, intervals, and views through lifecycle-aware APIs where available. Unload must release manually acquired resources and preserve user workspace state.
- Keep plugin data and settings backward compatible. Defaults must not erase existing values; migrations should preserve unknown fields when needed for compatibility.
- Reuse theme CSS variables and the current localization scheme. Check translation key coverage and that changing locale refreshes visible UI.
- Avoid injecting untrusted HTML. Use text nodes and the application's supported rendering APIs.
- Match Node/Electron usage to declared desktop/mobile support and test the affected platform.
- For release work, align the manifest, version mapping, built files, and documentation. Building or reviewing a release does not authorize publishing it.

Use an isolated test vault for destructive test cases, with representative notes and settings. Check enable, use, disable, and re-enable when lifecycle behavior changes.
