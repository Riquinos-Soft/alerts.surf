## 1. Local Development Foundation

- [x] 1.1 Add a committed local environment example, ignore rules for generated and secret files, and a Docker Compose definition for `frontend`, `backend`, and `db`; verify `docker compose --env-file .env.example config --quiet` succeeds and no populated `.env` is tracked.
- [x] 1.2 Add the pinned FastAPI, SQLAlchemy 2, Psycopg, Alembic, pytest, and httpx backend dependency files plus the minimal backend container setup; verify the backend image builds and can import the application package through Docker Compose.
- [x] 1.3 Bootstrap the minimal Vue 3, Vite, TypeScript, Vitest, and Vue Test Utils frontend with Bun plus its development container setup; verify the frontend image builds, the Bun lockfile is present, and the TypeScript check succeeds through Docker Compose.

## 2. Backend-to-PostgreSQL Status Behavior

- [x] 2.1 Add environment-driven backend configuration and the synchronous SQLAlchemy engine plus concrete `SELECT 1` connectivity probe; verify the probe succeeds against the Compose PostgreSQL service and closes its connection cleanly.
- [x] 2.2 Implement `GET /api/status` with the specified `200` and `503` JSON contracts and sanitized failure logging; verify API requests exercise both response paths without exposing connection details.
- [x] 2.3 Add pytest coverage that uses PostgreSQL for the healthy path and substitutes only the connectivity boundary for the unavailable path; verify the backend suite passes through Docker Compose and asserts the exact status codes and response bodies.
- [x] 2.4 Configure Alembic to consume `DATABASE_URL` without adding models, tables, or an empty revision; verify Alembic loads the configuration and connects to the Compose database while reporting no current revision.

## 3. Browser-Visible Application Status

- [x] 3.1 Configure Vite to proxy relative `/api` requests to the backend Compose service and implement the minimal Vue status screen; verify a delayed request shows `Checking alerts.surf status...`, a healthy response shows `alerts.surf is running`, and other outcomes show `alerts.surf is unavailable`.
- [x] 3.2 Add Vitest component coverage for loading, healthy, non-success, malformed-response, and network-failure states by controlling the `fetch` boundary; verify the frontend test suite passes through Docker Compose.

## 4. Integrated Acceptance and Developer Handoff

- [x] 4.1 Complete Compose startup dependencies, PostgreSQL health checking, service networking, ports, and source mounts; verify a clean `docker compose up --build` starts all three services and `GET /api/status` returns the healthy contract.
- [x] 4.2 Add concise developer instructions for configuration, startup, test commands, browser URL, shutdown, and troubleshooting the unavailable state; verify every documented command matches the Compose workflow and requires no host Python or Bun runtime.
- [x] 4.3 Run the backend tests, frontend type check, frontend tests, Compose configuration validation, and the manual healthy browser acceptance check; then stop PostgreSQL and verify the API returns `503` and the reachable frontend displays `alerts.surf is unavailable`.

## 5. Stable Local Commands

- [x] 5.1 Add a small root `Makefile` with phony `up`, `down`, `logs`, `ps`, `test`, and `clean` targets that delegate to Docker Compose and the existing containerized test commands; verify each target invokes the behavior defined in the capability spec without requiring host Python or Bun.
- [x] 5.2 Add `make bootstrap` so a missing `.env` is copied from `.env.example` before delegating to `make up`; verify on a fresh checkout that the files initially match, and verify separately that rerunning bootstrap leaves the checksum of an existing `.env` unchanged.
- [x] 5.3 Update the developer instructions to use the Make targets as the primary workflow and clearly distinguish volume-preserving `make down` from destructive `make clean`; run `make bootstrap`, `make ps`, `make test`, `make down`, and `make clean`, and confirm `.env.example` plus project configuration remain versionable while local-only files remain ignored.
