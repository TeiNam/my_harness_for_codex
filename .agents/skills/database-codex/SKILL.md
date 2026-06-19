---
name: database-codex
description: Use for SQL, migrations, schema design, indexes, query performance, Postgres, MySQL, SQLite, MongoDB, DynamoDB, or data-model review.
---

# Database Codex

Treat data changes as hard to undo.

1. Identify the engine first. Do not mix Postgres, MySQL, SQLite, MongoDB, and DynamoDB advice.
2. Read existing migration naming, rollback, and transaction patterns before adding a migration.
3. Preserve data unless the user explicitly asks for destructive cleanup.
4. Match indexes to observed query predicates and sort order; do not add indexes speculatively.
5. For relational schemas, prefer constraints for invariants the database can enforce.
6. For NoSQL, start from access patterns and partition keys. Do not normalize by habit.
7. Add a rollback note, migration test, or query check when the project has that pattern.

Ask before changing production-like connection settings, credentials, or irreversible migrations.
