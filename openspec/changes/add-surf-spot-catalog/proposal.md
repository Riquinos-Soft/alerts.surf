## Why

alerts.surf currently proves that the frontend, backend, and database are connected, but it does not expose any surf-related product behavior. A small read-only spot catalog is the narrowest useful slice that introduces the first domain concept and exercises real persisted data without requiring conditions providers, maps, accounts, or administration.

## What Changes

- Add a public backend endpoint that returns a list of surf spots stored in PostgreSQL.
- Persist the minimum catalog fields needed to identify and locate a spot by name, region, and country code.
- Display the catalog in the Vue frontend with explicit loading, populated, empty, and unavailable states.
- Add an Alembic migration for the spot catalog and deterministic, idempotent sample data for local development only.
- Add backend and frontend automated tests plus the minimal local developer documentation required to exercise the slice.

## Capabilities

### New Capabilities

- `surf-spot-catalog`: Publicly list persisted surf spots and present the catalog state in the frontend.

### Modified Capabilities

None.

## Impact

- Backend: a small surf-spot catalog module, a read-only HTTP endpoint, SQLAlchemy persistence, and an Alembic migration.
- Frontend: the existing application screen gains a minimal surf-spot catalog section.
- Local workflow: local bootstrap gains idempotent development-only sample data while preserving existing environment files and commands.
- Tests and documentation: backend and frontend coverage for catalog behavior and updated local run instructions.
- No new dependencies, external providers, authentication, maps, conditions, alerts, queues, caches, AI, or production deployment work.
