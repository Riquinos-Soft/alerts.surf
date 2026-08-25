## Context

See `proposal.md` for motivation and `specs/application-status/spec.md` for the behavior contract. At the start of this change the repository contained OpenSpec guidance but no application code, so this slice establishes the initial executable structure while preserving the modular-monolith direction and avoiding surf-domain placeholders.

The request crosses the browser, HTTP API, database, tests, and local container runtime. Those boundaries justify a design document, but not additional services or generic architectural layers.

## Goals / Non-Goals

**Goals:**

- Prove the request path from a Vue page through FastAPI to a real PostgreSQL connection.
- Make healthy, loading, and unavailable states explicit and testable.
- Provide one reproducible Docker Compose workflow for local development and tests.
- Provide a small, stable Make interface over the local workflow without moving application logic into build recipes.
- Establish only the persistence and migration configuration needed for later vertical slices.
- Keep failure details observable in backend logs without exposing internal errors through the API.

**Non-Goals:**

- Modeling surf spots, conditions, alerts, users, or any other domain concept.
- Establishing domain, application, and infrastructure directory layers before domain behavior requires them.
- Creating placeholder database tables or migrations.
- Adding authentication, maps, PWA behavior, external data providers, production deployment, Caddy, or GitHub Actions.
- Adding Redis, queues, pgvector, AI tooling, microservices, Kubernetes, or an end-to-end browser testing framework.

## Decisions

### 1. Use one repository with two application directories

Place the Vue application under `frontend/`, the FastAPI application under `backend/`, and Docker Compose plus developer documentation at the repository root. The backend remains one deployable modular monolith. Its initial package contains only application startup, the status route, configuration, and concrete database connectivity code; it does not create empty bounded contexts or domain/application/infrastructure layers.

**Alternatives considered:** A workspace framework would add tooling with no current benefit. Pre-creating a layered backend skeleton would imply boundaries before domain behavior exists. Multiple backend services would violate the agreed modular-monolith direction.

### 2. Treat the status endpoint as a readiness check

Expose `GET /api/status` with the exact response and HTTP semantics in the capability spec. Each request performs a lightweight `SELECT 1` through a synchronous SQLAlchemy 2 engine using the Psycopg PostgreSQL driver. The FastAPI handler is synchronous so the blocking database call runs in FastAPI's worker thread rather than blocking the event loop.

The database probe is a small concrete function used directly by the route. No repository, service interface, ORM model, or generic health-check framework is introduced. Expected connectivity failures produce the specified `503` response and a sanitized log entry; raw connection errors are not returned to the browser.

**Alternatives considered:** Calling Psycopg directly would not prove the agreed SQLAlchemy integration. An async SQLAlchemy engine would require an additional async driver and lifecycle complexity without improving this low-volume status endpoint. A separate liveness endpoint is not required by this slice.

### 3. Use a same-origin frontend API path in local development

The frontend calls the relative path `/api/status`. Vite proxies `/api` to the backend service inside the Compose network, so the browser uses the frontend origin and the backend does not need permissive CORS configuration. A single minimal Vue screen owns the loading, running, and unavailable presentation and validates the small response shape without a runtime-schema dependency.

**Alternatives considered:** Calling a separate backend origin from the browser would require CORS and browser-visible environment configuration. Adding a frontend data-fetching library would be unnecessary for one request.

### 4. Configure Alembic without inventing a schema

Configure Alembic to read the same `DATABASE_URL` as the application, but do not create a migration or ORM model in this change. The first feature that owns persistent data will introduce its model metadata and first migration. This proves that the migration tool is wired without creating a meaningless table.

**Alternatives considered:** A placeholder table or empty revision would create history without product behavior. A shared declarative base can be introduced alongside the first actual persisted model, when its ownership is known.

### 5. Make Docker Compose the supported local entry point

Define `frontend`, `backend`, and `db` services. PostgreSQL receives a health check, and the backend waits for that health condition before starting. The frontend proxies to the backend by its Compose service name. Source mounts and development commands provide local iteration while keeping normal host prerequisites limited to Docker with Compose and Make.

Environment-specific values come from environment variables. Commit only documented example values suitable for local development; never commit a populated `.env` or real credentials. Caddy and production container orchestration remain deferred.

**Alternatives considered:** Running some services directly on the host would not satisfy the required integrated workflow. Adding a reverse proxy would duplicate Vite's development proxy and prematurely introduce production concerns.

### 6. Use existing package managers without adding a Python environment tool

Use Bun and its lockfile for frontend dependencies. Use pinned pip requirement files for the backend and test dependencies, avoiding an unrequested Python package manager such as Poetry or uv. Backend HTTP test clients use httpx through FastAPI's testing support.

**Alternatives considered:** Poetry or uv may improve later workflows but would be an additional technology not required to prove this slice. Unpinned requirements would reduce reproducibility.

### 7. Test behavior at the smallest meaningful boundaries

Use pytest to exercise the FastAPI contract. The healthy integration test uses the Compose PostgreSQL service so the real SQLAlchemy connection path is covered; the unavailable case substitutes only the concrete connectivity boundary. Use Vitest and Vue Test Utils to verify loading, healthy, malformed, non-success, and network-failure states by controlling `fetch`. Do not add Playwright or another browser test framework for this slice.

Expose a `make test` command that runs both suites through Docker Compose. The manual acceptance check is opening the frontend from a healthy Compose stack and observing `alerts.surf is running`.

### 8. Use Make as a thin local-development interface

Add one root `Makefile` with phony targets and no application logic. Its recipes delegate directly to Docker Compose or to the already-defined commands inside the service containers:

- `make up` builds the images and starts the stack in detached mode, waiting for service health.
- `make down` stops and removes the local service containers and network while retaining named volumes.
- `make logs` follows the Compose logs for the stack until interrupted.
- `make ps` displays the Compose service status.
- `make test` runs pytest in the backend container and Vitest in the frontend container; it does not require host Python or Bun.
- `make clean` brings the project down and removes its named volumes and orphaned containers, including local PostgreSQL data.
- `make bootstrap` copies `.env.example` to `.env` only when `.env` is absent, then delegates to `make up`. An existing `.env` remains byte-for-byte unchanged.

The Makefile uses the root `.env` for Compose commands after bootstrap. `.env.example` remains version-controlled documentation with non-secret local defaults, while `.env` and other local environment variants remain ignored. The ignore file also excludes generated Python, Node/Bun, operating-system, and common IDE files without excluding project configuration such as `AGENTS.md`, `openspec/`, `.agents/`, `bun.lock`, `compose.yaml`, or the Makefile itself.

**Alternatives considered:** Repeating full Compose commands only in documentation provides no stable shorthand. Installing Bun or Python on the host duplicates the container toolchain. A task runner dependency or separate shell scripts would add machinery without improving these seven small commands.

## Risks / Trade-offs

- **A database query is executed for every status request** → Keep the query trivial and uncached for honest readiness; revisit only if monitoring traffic creates measurable load.
- **Compose startup order does not guarantee permanent availability** → Use PostgreSQL startup health checks, while preserving runtime `503` behavior if the database later becomes unavailable.
- **The Vite proxy is development-specific** → Keep the browser contract at relative `/api`; a future deployment spec can map that path through Caddy without changing frontend behavior.
- **Synchronous database access is not the likely final choice for every workload** → Limit the decision to this status slice and revisit when a real feature demonstrates concurrency needs.
- **No migration is produced by the initial Alembic setup** → Verify Alembic can load its configuration; require the first persisted feature to add the initial meaningful revision.
- **`make clean` is intentionally destructive to local named volumes** → Name this behavior explicitly in help documentation and reserve `make down` for the non-destructive shutdown path.
- **Make recipes rely on a POSIX-style shell and a current Docker Compose v2 plugin** → Document the requirement; on native Windows the supported path is an environment such as WSL that provides Make and POSIX command semantics.

## Migration Plan

There is no existing application or data to migrate. Implementation adds the bootstrap files and root Makefile, validates both test suites, starts the Compose stack, and checks the documented browser behavior. Rollback consists of stopping the Compose stack and reverting the bootstrap change; `make clean` may remove the local PostgreSQL volume explicitly when the developer no longer needs its local data.

## Decisions Requiring Review

- Confirm the proposed synchronous SQLAlchemy 2 plus Psycopg approach rather than adopting async database access in the first slice.
- Confirm the exact `200`/`503` API contract and the three user-visible messages defined in the spec.
- Confirm that Alembic should be configured without an initial empty migration or placeholder model.
- Confirm pinned pip requirement files as the initial Python dependency workflow; no additional Python package manager is proposed.
- Confirm that `make up` runs detached and waits for health, while `make logs` follows all Compose service logs.
- Confirm that the deliberately destructive contract of `make clean` includes removal of the project PostgreSQL volume.
