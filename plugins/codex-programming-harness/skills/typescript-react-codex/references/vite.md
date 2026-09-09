# Vite Boundaries

- Inspect the installed Vite version, plugins, build scripts, and environment-prefix configuration before editing.
- Treat values exposed to client code through environment prefixes or `define` as public. Inspect what reaches the bundle; loading a value in build configuration is different from exposing it to the client.
- Keep server credentials on the server. Minification or removing source maps does not hide an embedded secret.
- Validate public configuration and keep development, preview, and production behavior distinct.
- Limit dev-server hosts, CORS, and filesystem access to the actual workflow. Do not disable access checks as a generic fix for connectivity.
- If source maps are private, verify deployment excludes them. A hidden source-map comment does not prevent direct retrieval of a deployed map.
- Verify type checking separately when the project's build only transpiles TypeScript.
- After configuration changes, exercise the affected dev or production path; one does not prove the other works.

Consult the installed version's official documentation for option names and defaults rather than copying old configuration examples.
