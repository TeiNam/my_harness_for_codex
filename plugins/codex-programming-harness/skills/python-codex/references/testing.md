# Test Isolation

Use the current test runner and test the observable result at the boundary that failed.

- Patch the name where the code under test looks it up. With `from mailer import send` in `notifier`, patch `notifier.send`.
- Use `autospec` or an appropriate spec when it helps detect signature drift. Do not mock the function whose behavior is being tested.
- For async collaborators, use an async mock and assert it was awaited when awaiting is part of the contract.
- Isolate files in temporary directories. Restore environment variables, working directory, dependency overrides, and global state during teardown.
- Control time and randomness at the relevant boundary. Prefer deterministic inputs or an existing clock seam over real sleeps.
- Mock external side effects without replacing the business logic. Check real persistence behavior in an isolated database when the defect depends on it.
- For failure or cancellation paths, assert resource cleanup and the final persisted or returned state.

One focused regression check is usually enough for a narrow fix. Do not add a testing framework, fixture hierarchy, or coverage threshold just to follow this reference.
