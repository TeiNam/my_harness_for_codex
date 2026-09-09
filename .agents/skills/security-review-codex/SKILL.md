---
name: security-review-codex
description: Review security boundaries in code, especially authentication, authorization, sensitive data, uploads, and payment flows. Use for a security review or a change that alters those boundaries.
---

# Security Review

Find reachable failure modes in the requested surface.

1. Identify the untrusted input, authenticated identity, protected resource, and sensitive operation. Trace the real call path, including middleware and database enforcement.
2. Check server-side ownership and tenant checks for reads and writes. A valid login must not grant access to another user's object.
3. Follow input into SQL, shell commands, paths, outbound URLs, and HTML. Use parameter binding, argument arrays, path containment, and context-appropriate escaping. Validate uploads on the server rather than trusting a supplied MIME type.
4. Inspect session and token verification, expiry, cookie settings, and CSRF protection as applicable to the actual auth scheme. Preserve the project's auth design unless changing it is required.
5. Check response schemas, logs, error paths, client bundles, and committed configuration for secret or personal-data exposure. Report locations and redacted evidence, never secret values.
6. For retryable writes or payments, check authorization, atomicity, idempotency, and concurrent requests together.
7. Use the project's existing scanner when useful. Confirm affected versions and reachability before promoting a scanner result to a finding.

For each finding, give severity, file and line, exploit preconditions, concrete impact, and a minimal fix. Separate confirmed defects from questions that need runtime evidence.

When implementing a fix, add the smallest negative check that would expose the defect: another tenant, expired credential, malformed input, or duplicate write. Also verify that the authorized path still works.

Keep review output as findings unless fixes are requested. Do not run live exploits, rewrite git history, rotate credentials, or run bulk dependency upgrades as a side effect of reviewing code.
