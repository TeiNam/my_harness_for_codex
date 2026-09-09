# State Transition Checks

Scope the trace to the reported workflow and consumers of changed shared actions.

1. Identify the control, its label's promise, and its handler.
2. Trace calls in execution order. For each call, record fields read, written, or reset, including indirect store effects.
3. Follow effects, subscriptions, navigation, and async completions triggered by those writes.
4. Compare the final visible and persisted state with the promised outcome.
5. Reproduce the relevant ordering in the browser or a focused integration test.

Look for:

- A later action resetting state set by an earlier action.
- An older request completing after a newer one and overwriting its result.
- A closure reading stale state or multiple updates using the same old value.
- An effect undoing the user's action.
- Validation succeeding without the write or navigation actually occurring.
- An optimistic update that is never reconciled after failure.

Example: `setComposeMode(true)` followed by `selectThread(null)` can leave compose mode false if selecting a thread also resets compose state. Check the shared action's other callers before changing it.

Report the control, file and line, ordered transition, expected result, actual result, and smallest fix. A full-app audit or parallel agent split is unnecessary for a single broken control.
