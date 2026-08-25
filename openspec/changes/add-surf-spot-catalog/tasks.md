## 1. Persist the Spot Catalog

- [ ] 1.1 Add the concrete synchronous SQLAlchemy session setup and `surf_spots` model with only the approved fields and constraints; create the first Alembic revision and verify upgrade creates the expected empty table while downgrade removes it.
- [ ] 1.2 Add the explicit development seed command for Mundaka and Pantín without placing data in the migration; add backend tests proving the command is idempotent and migration alone leaves the catalog empty.

## 2. Expose the Backend Catalog

- [ ] 2.1 Add the focused spots router and `GET /api/spots` query, include it from the FastAPI application, and add PostgreSQL-backed tests for the empty response, public response shape, and deterministic name/region ordering.
- [ ] 2.2 Translate catalog database failures to the stable HTTP `503` response without leaking connection details, and add a backend test covering that failure boundary.

## 3. Present the Frontend Catalog

- [ ] 3.1 Extend the existing Vue screen with an independent catalog request and strict payload validation; add Vitest coverage for loading, populated, empty, malformed, non-success, and network-failure states while retaining all application-status tests.
- [ ] 3.2 Add only the minimal catalog markup and styling needed to display every spot accessibly, and verify the rendered tests assert the visible heading, spot fields, and state messages.

## 4. Integrate the Local Workflow

- [ ] 4.1 Add small container-delegating `migrate` and `seed` Make targets, update `bootstrap` and `test` in dependency order without overwriting `.env`, and verify repeated bootstrap produces no duplicate spots with Docker and Make as the only host requirements.
- [ ] 4.2 Update the developer documentation with migration, seed, sample catalog, and reset instructions; verify a fresh local bootstrap makes both sample spots available from the API and visible in the browser.

## 5. Verify the Vertical Slice

- [ ] 5.1 Run backend tests, frontend tests, frontend type checking, Compose validation, Alembic upgrade/downgrade checks, and strict OpenSpec validation; record the results and confirm no out-of-scope functionality, dependency, infrastructure, or unrelated file changes were introduced.
