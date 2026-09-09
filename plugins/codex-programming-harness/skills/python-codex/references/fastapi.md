# FastAPI and Async Boundaries

Follow the project's installed FastAPI, Pydantic, HTTP client, and database versions; consult their documentation for version-dependent behavior.

- Keep request validation and response serialization explicit. Response schemas must exclude passwords, tokens, and internal authorization fields.
- Distinguish omitted PATCH fields from explicit nulls; preserve the API's update semantics.
- Check authorization against the resource being accessed, not only the existence of an authenticated user.
- Do not call blocking network or database code directly inside an async handler. Reuse the project's async client or established offloading mechanism.
- Bound outbound calls with timeouts. Retry only when the operation's semantics permit it.
- Manage shared clients and pools in the existing application lifespan. Manage request-scoped sessions with cleanup that also runs on errors and cancellation.
- Make the transaction owner explicit. Verify that a failed commit cannot produce a successful response; do not move commits into deferred cleanup without checking framework timing.
- Preserve cancellation and close acquired resources. Avoid broad exception handling that turns failures into success responses.

## Tests

- Override the actual callable used by `Depends`, rather than an unrelated helper or its original definition.
- Save and restore dependency overrides with teardown that runs even when a test fails.
- Use the project's supported ASGI test transport. Check whether it runs lifespan; transport setup alone may not initialize or close application resources.
- Exercise validation, authorization, response filtering, and dependency failures relevant to the change.
- Keep real production connections out of fixtures. Use the existing isolated database when database semantics matter; a substitute engine may conceal SQL or transaction differences.
