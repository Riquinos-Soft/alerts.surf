## Why

alerts.surf needs a minimal executable baseline that proves the agreed frontend, backend, and database stack can work together before any surf-domain behavior is introduced. Establishing this vertical slice first reduces integration risk while producing a small, visible result that can be reviewed end to end.

## What Changes

- Add a local Docker Compose workflow that runs a Vue 3 frontend, a FastAPI backend, and PostgreSQL together.
- Add a small root `Makefile` that provides stable commands for bootstrapping, starting, stopping, inspecting, testing, and cleaning the local stack while delegating to Docker Compose and existing project tooling.
- Add an application status API that reports success only when the backend can reach PostgreSQL.
- Add a minimal alerts.surf screen that calls the status API and visibly reports whether the application is running correctly.
- Add focused backend and frontend tests for the meaningful healthy and unavailable states.
- Add only the minimum SQLAlchemy 2 and Alembic setup needed to establish database connectivity and an evolution path; no surf-domain schema is introduced.
- Add concise developer instructions for running and testing the slice locally with Docker and Make as the normal host dependencies.

## Capabilities

### New Capabilities

- `application-status`: Defines the end-to-end application status behavior exposed by the backend and presented by the frontend, including PostgreSQL connectivity.

### Modified Capabilities

None.

## Impact

- Introduces the initial frontend, backend, database, and local container structure.
- Introduces Vue 3, Vite, TypeScript, Bun, FastAPI, PostgreSQL, SQLAlchemy 2, Alembic, pytest, Vitest, and Docker Compose as directly required by this slice.
- Introduces Make as a thin, host-level command interface; it does not contain application logic or replace the underlying tools.
- Adds one backend HTTP endpoint and one minimal frontend screen; no surf-domain entities, user features, production deployment, Caddy, CI/CD, or deferred infrastructure are included.
