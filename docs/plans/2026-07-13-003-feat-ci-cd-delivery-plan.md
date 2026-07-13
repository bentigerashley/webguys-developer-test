---
title: "CI/CD Delivery - Plan"
date: 2026-07-13
type: feat
artifact_contract: ce-unified-plan/v1
artifact_readiness: implementation-ready
product_contract_source: ce-brainstorm
execution: code
---

# CI/CD Delivery - Plan

## Goal Capsule

- **Objective:** Make every push or merge to `main` prove the Next.js frontend is healthy and deploy the verified build to a staging server over SSH.
- **Product authority:** Part 3 of the developer-test brief and the repository's existing Next.js, WordPress plugin, and PHP test structure.
- **Open blockers:** Publishing requires a GitHub repository and SSH staging credentials that are not present locally; implementation must make those operator-supplied dependencies explicit without committing secrets.

---

## Product Contract

### Summary

The repository will be ready for a GitHub-hosted delivery flow that validates the complete frontend before deploying over SSH. The reviewer handoff will explain both the automated staging path and how to run the WordPress pieces in Local WP when no public staging environment is available.

### Requirements

**Continuous integration**

- R1. A GitHub Actions workflow triggers on every push to `main`, including merge commits that land on `main`, and supports a manual dispatch for recovery or demonstration.
- R2. The workflow installs the pinned Node version and locked dependencies, then runs frontend linting, type safety, tests, and a production build before any deployment step can start.
- R3. PHP plugin behavior is exercised in CI with a compatible PHP runtime so backend regressions are visible alongside frontend failures.
- R4. Dependency caching may speed up repeat runs but must not replace lockfile-based installation or any quality gate.

**Secure deployment**

- R5. Deployment uses SSH-based transport only after all validation jobs succeed; FTP is not used.
- R6. Hostname, username, port, private key, host fingerprint, destination path, and public WordPress GraphQL endpoint are supplied through GitHub repository secrets or variables and never committed.
- R7. The deployment is repeatable, fails on transfer or remote activation errors, and avoids exposing secret values in logs.
- R8. The server receives a self-contained production-ready Next.js standalone artifact and uses an explicit remote command to activate the release and restart the configured application process without a server-side package installation.

**Reviewer deliverables**

- R9. Repository documentation lists the required GitHub secrets/variables, `main` branch setup, server prerequisites, first-deploy procedure, rollback expectations, and troubleshooting checks.
- R10. Local setup documentation explains how to install and activate both WordPress plugins in Local WP, enable WPGraphQL/ACF dependencies, configure the frontend GraphQL URL, and verify frontend and backend behavior.
- R11. A release-readiness script or documented command set lets a reviewer reproduce the same lint, typecheck, test, build, and PHP checks locally.
- R12. When external credentials are unavailable, the completed handoff clearly identifies the absent GitHub/staging deliverables rather than fabricating URLs or credentials.

### Acceptance Examples

- AE1. Given a commit pushed to `main`, GitHub Actions runs frontend lint, typecheck, tests, build, and PHP tests; deployment does not begin if any gate fails.
- AE2. Given all gates pass and valid SSH settings exist, the workflow verifies the server host key, transfers the release, activates it remotely, and restarts the application without FTP.
- AE3. Given a pull request or non-`main` branch push, the production/staging deployment job does not run.
- AE4. Given a fresh Local WP site, a reviewer can follow the repository instructions to install the included plugins, configure required dependencies, connect the Next.js frontend, and observe article-detail URLs from the backend integration.
- AE5. Given missing GitHub or server credentials, local validation remains runnable and documentation names the external setup still required.

### Scope Boundaries

In scope: GitHub Actions, a real lint command and configuration, frontend/PHP validation, SSH deployment automation, secret and server contracts, local release verification, and Local WP/reviewer documentation.

Out of scope: purchasing or provisioning a server, creating DNS/TLS certificates, inventing GitHub or SSH credentials, committing a private key or database containing secrets, changing the application design, and weakening checks to obtain a green workflow.

### Key Decisions

- GitHub Actions owns validation and deployment because the brief explicitly requires GitHub and `main`-branch automation.
- Deployment is gated behind a GitHub environment so secrets remain scoped and maintainers may add approval protection without changing the workflow.
- SSH host verification is mandatory; disabling strict host checking is not an acceptable shortcut.
- The public handoff favors staging when credentials exist and Local WP instructions when they do not; neither URL nor database is fabricated.

---

## Planning Contract

Product Contract unchanged.

### Key Technical Decisions

- KTD1. Add ESLint 9 with the Next.js flat configuration and make lint a first-class package script so CI invokes a real, locally reproducible gate.
- KTD2. Build Next.js in standalone mode and package the standalone server, static assets, and public files as one release archive. This avoids copying development dependencies to the server.
- KTD3. Use native OpenSSH tools on the GitHub-hosted runner. A stored `SSH_KNOWN_HOSTS` value seeds strict host verification; the deploy key is written with restrictive permissions and removed by runner teardown.
- KTD4. Upload each immutable commit archive and invoke the repository-owned `scripts/activate-release.sh` with separately quoted release ID, archive path, deploy root, and service name. The script validates inputs, locks activation, extracts to a new release directory, atomically updates `current`, restarts a user-level systemd service, verifies health, rolls back on failure, and retains a bounded release history.
- KTD5. Keep validation and deployment as separate jobs, with deployment restricted to `refs/heads/main` and a `staging` GitHub environment.
- KTD6. Serialize staging deployments with a named concurrency group and do not cancel an in-progress activation; queued superseded runs may be replaced by the newest pending `main` commit.
- KTD7. Supply `WORDPRESS_GRAPHQL_URL` both to the CI build and as a `.env.production` file inside the standalone release so ISR uses the same public endpoint after activation.

### Assumptions

- The target is a Linux server with OpenSSH, `tar`, Node.js 20+, and an existing process-manager/service definition.
- GitHub environment secrets will provide `SSH_HOST`, `SSH_USER`, `SSH_PRIVATE_KEY`, and `SSH_KNOWN_HOSTS`; variables will provide numeric `SSH_PORT`, absolute `DEPLOY_PATH`, safe `SERVICE_NAME`, public `WORDPRESS_GRAPHQL_URL`, and `HEALTHCHECK_URL`.
- The repository owner will create or connect the GitHub repository and staging host because neither exists in the checkout.

---

## Implementation Units

### U1. Add reproducible frontend linting and standalone output

- **Goal:** Make lint and deployable build output locally reproducible.
- **Files:** `frontend/package.json`, `frontend/package-lock.json`, `frontend/eslint.config.mjs`, `frontend/next.config.ts`
- **Covers:** R2, R4, R8, R11, AE1.
- **Test scenarios:** ESLint passes the current source and tests; a deliberate lint violation fails; production build emits a standalone server and static assets; existing tests and typecheck remain green.

### U2. Add main-branch GitHub Actions validation and SSH deployment

- **Goal:** Implement the ordered CI/CD contract without embedded credentials.
- **Files:** `.github/workflows/deploy-staging.yml`, `.github/dependabot.yml`, `scripts/activate-release.sh`, `scripts/rollback-release.sh`
- **Covers:** R1-R8, AE1-AE3, KTD2-KTD5.
- **Test scenarios:** Workflow syntax parses; triggers include `push` on `main` and manual dispatch; validation runs lint, typecheck, tests, build, and PHP tests; deploy depends on validation, is main-only, serialized, and staging-environment scoped; preflight rejects missing values, nonnumeric ports, non-absolute deploy roots, unsafe service names, and mismatched known-host entries before SSH/SCP; activation locks, atomically switches, health-checks, rolls back, and returns nonzero on failure; permissions are read-only and all actions are commit-SHA pinned.

### U3. Add local release verification and reviewer setup documentation

- **Goal:** Make the delivery flow reproducible without access to GitHub or staging infrastructure.
- **Files:** `scripts/verify-release.ps1`, `README.md`, `frontend/README.md`, `docs/deployment.md`, `docs/local-wp-setup.md`, `.gitignore`
- **Covers:** R9-R12, AE4-AE5.
- **Test scenarios:** The verification script fails fast, preflights local PHP or Docker, and propagates gate failures; documentation names every required secret/variable and server prerequisite; Local WP instructions cover plugin dependencies, static front-page creation/assignment, cache configuration/manual refresh, direct GraphQL queries for homepage and article URLs, `frontend/.env.local`, dev-server restart, and Local's HTTPS certificate caveat; absent external URLs are reported as pending credentials rather than presented as live.

---

## Verification Contract

| Gate | Command or method | Done signal |
|---|---|---|
| Lint | `cd frontend && npm run lint` | ESLint exits cleanly |
| Type safety | `cd frontend && npm run typecheck` | TypeScript exits cleanly |
| Frontend tests | `cd frontend && npm test -- --run` | Vitest passes |
| Production build | `cd frontend && npm run build` | Standalone build succeeds and `.next/standalone` exists |
| PHP tests | `docker run --rm -v "${PWD}:/app" -w /app php:8.2-cli php spaceflight-news-cache/tests/run.php` | All PHP groups pass |
| Workflow audit | Inspect workflow triggers, dependencies, conditions, secrets, permissions, and SSH host verification | No deploy before validation; no credential or FTP leakage |
| Local release gate | `powershell -ExecutionPolicy Bypass -File scripts/verify-release.ps1` | All reproducible gates pass |

---

## Definition of Done

- A valid workflow triggers for every push/merge to `main` and can be dispatched manually.
- Frontend lint, typecheck, tests, build, and backend PHP tests all gate deployment.
- The deploy job uses a staging environment, native SSH transport, strict host verification, and repository-managed secret references only.
- Standalone release packaging and the remote activation contract are documented and reproducible.
- Local WP setup and local release verification are complete enough for a reviewer without staging access.
- The repository contains no secret, private key, fabricated GitHub URL, fabricated staging URL, or claimed database export.
- All local verification gates pass and changes are committed; publishing remains explicitly blocked until a remote and server credentials are supplied.
