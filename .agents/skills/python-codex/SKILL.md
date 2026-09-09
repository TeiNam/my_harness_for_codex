---
name: python-codex
description: Use for Python coding, tests, FastAPI, data scripts, packaging, async code, or Python bug fixes. Keep changes small and verified.
---

# Python Codex

Prefer boring Python.

1. Inspect `pyproject.toml`, `requirements*.txt`, `uv.lock`, `poetry.lock`, or existing test commands before choosing tooling.
2. Use stdlib first: `pathlib`, `dataclasses`, `contextlib`, `functools`, `collections`, `sqlite3`, `csv`, `json`, `argparse`, `unittest.mock`.
3. Preserve public function signatures unless the task explicitly allows API changes.
4. For FastAPI, keep request validation in Pydantic models and dependency wiring near existing route patterns.
5. For data scripts, avoid loading whole datasets when streaming or column selection is already available.
6. Add the smallest test or `__main__` self-check that catches the changed behavior.
7. Run the narrowest relevant command first, such as one test file, then broaden only if needed.

Avoid new frameworks, global config systems, or class hierarchies for single-use logic.

Read only the reference relevant to the change:

- [FastAPI and async resource boundaries](references/fastapi.md) for routes, dependency overrides, lifespan, or async clients.
- [Test isolation](references/testing.md) for mocks, external side effects, or async regression tests.
