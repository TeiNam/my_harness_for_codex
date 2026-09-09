---
name: deployment-codex
description: Change or troubleshoot Docker, Compose, CI/CD, health checks, and release or rollback procedures using the project's existing deployment setup.
---

# Deployment

Work from the actual environment, artifact, and recovery path.

1. Read the Dockerfile, Compose files, CI workflow, deployment configuration, and relevant runbook. Confirm which overrides and environment the command will use.
2. Keep the existing platform and release strategy. Introduce additional infrastructure only when the request or observed limitation requires it.
3. Build from the lockfile and explicit base-image version or digest. Keep secrets out of build arguments, image layers, and logs; use the existing secret mechanism.
4. Distinguish container-local addresses, service DNS, and host ports. Publish only needed ports and preserve named volumes and bind mounts containing data.
5. Make health checks exercise the intended condition. Separate readiness from process liveness when supported; allow startup time and close resources on shutdown.
6. Identify the deployed artifact and previous working artifact. Check whether old and new application versions can coexist with the schema change.
7. Validate the changed configuration with existing tooling. For Compose, `docker compose config --quiet` checks configuration without printing resolved secrets; use the same file selection as the intended deployment.

A rollback must restore working behavior, not just mark a migration as rolled back. Describe application rollback and data recovery separately. Never imply that changing migration metadata restores dropped or rewritten data.

Prepare the exact target, configuration diff or available dry-run, health check, and rollback before a live operation. Continue within the user's existing authorization; ask only when the concrete action exceeds it. Do not remove volumes, prune shared resources, or change cloud infrastructure merely to fix a local build.

After an authorized rollout, check the deployed revision, readiness, one representative request, and relevant errors. Stop rollout expansion if those checks fail and use only the recovery actions already authorized.
