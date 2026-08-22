## Context

See `proposal.md` for motivation and `specs/application-status/spec.md` for the behavior contract. The repository currently contains OpenSpec guidance but no application code, so this slice establishes the initial executable structure while preserving the modular-monolith direction and avoiding surf-domain placeholders.

The request crosses the browser, HTTP API, database, tests, and local container runtime. Those boundaries justify a design document, but not additional services or generic architectural layers.

## Goals / Non-Goals

**Goals:**

- Prove the request path from a Vue page through FastAPI to a real PostgreSQL connection.
- Make healthy, loading, and unavailable states explicit and testable.
- Provide one reproducible Docker Compose workflow for local development and tests.
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

Define `frontend`, `backend`, and `db` services. PostgreSQL receives a health check, and the backend waits for that health condition before starting. The frontend proxies to the backend by its Compose service name. Source mounts and development commands provide local iteration while keeping host prerequisites limited to Docker Compose.

Environment-specific values come from environment variables. Commit only documented example values suitable for local development; never commit a populated `.env` or real credentials. Caddy and production container orchestration remain deferred.

**Alternatives considered:** Running some services directly on the host would not satisfy the required integrated workflow. Adding a reverse proxy would duplicate Vite's development proxy and prematurely introduce production concerns.

### 6. Use existing package managers without adding a Python environment tool

Use Bun and its lockfile for frontend dependencies. Use pinned pip requirement files for the backend and test dependencies, avoiding an unrequested Python package manager such as Poetry or uv. Backend HTTP test clients use httpx through FastAPI's testing support.

**Alternatives considered:** Poetry or uv may improve later workflows but would be an additional technology not required to prove this slice. Unpinned requirements would reduce reproducibility.

### 7. Test behavior at the smallest meaningful boundaries

Use pytest to exercise the FastAPI contract. The healthy integration test uses the Compose PostgreSQL service so the real SQLAlchemy connection path is covered; the unavailable case substitutes only the concrete connectivity boundary. Use Vitest and Vue Test Utils to verify loading, healthy, malformed, non-success, and network-failure states by controlling `fetch`. Do not add Playwright or another browser test framework for this slice.

Document commands that run both suites through Docker Compose. The manual acceptance check is opening the frontend from a healthy Compose stack and observing `alerts.surf is running`.

## Risks / Trade-offs

- **A database query is executed for every status request** → Keep the query trivial and uncached for honest readiness; revisit only if monitoring traffic creates measurable load.
- **Compose startup order does not guarantee permanent availability** → Use PostgreSQL startup health checks, while preserving runtime `503` behavior if the database later becomes unavailable.
- **The Vite proxy is development-specific** → Keep the browser contract at relative `/api`; a future deployment spec can map that path through Caddy without changing frontend behavior.
- **Synchronous database access is not the likely final choice for every workload** → Limit the decision to this status slice and revisit when a real feature demonstrates concurrency needs.
- **No migration is produced by the initial Alembic setup** → Verify Alembic can load its configuration; require the first persisted feature to add the initial meaningful revision.

## Migration Plan

There is no existing application or data to migrate. Implementation adds the bootstrap files, validates both test suites, starts the Compose stack, and checks the documented browser behavior. Rollback consists of stopping the Compose stack and reverting the bootstrap change; the local PostgreSQL volume may be removed explicitly if the developer no longer needs its empty data directory.

## Decisions Requiring Review

- Confirm the proposed synchronous SQLAlchemy 2 plus Psycopg approach rather than adopting async database access in the first slice.
- Confirm the exact `200`/`503` API contract and the three user-visible messages defined in the spec.
- Confirm that Alembic should be configured without an initial empty migration or placeholder model.
- Confirm pinned pip requirement files as the initial Python dependency workflow; no additional Python package manager is proposed.
