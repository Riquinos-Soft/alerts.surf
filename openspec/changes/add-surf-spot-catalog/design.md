## Context

The application currently has one FastAPI module, a synchronous SQLAlchemy engine used for the status probe, an Alembic environment with no revisions, and one Vue component that renders application health. See `proposal.md` for the motivation and `specs/surf-spot-catalog/spec.md` for the observable contract.

This slice crosses the backend, PostgreSQL schema, local workflow, and frontend, so it needs a small design. It does not yet contain surf-condition business rules that would justify domain/application/infrastructure layers.

## Goals / Non-Goals

**Goals:**

- Introduce the first cohesive surf-domain feature without restructuring the status slice.
- Keep the catalog read path synchronous and explicit.
- Make a fresh local bootstrap display deterministic sample content without mixing that content into schema migrations.
- Preserve independent frontend states for application health and the spot catalog.

**Non-Goals:**

- Public spot identifiers, spot detail pages, mutations, search, pagination, coordinates, maps, conditions, alerts, users, or authorization.
- A generic repository, service layer, unit-of-work abstraction, or shared domain framework.
- Production data loading or deployment automation.

## Decisions

### Keep the backend feature in one focused module

Add a `spots` feature module containing the SQLAlchemy model, response models, synchronous catalog query, and FastAPI router. Add only the shared session factory/dependency needed to execute that query to the existing database module, then include the router from the application entry point.

This makes the first bounded context visible while avoiding empty domain, application, and infrastructure packages. Splitting the feature into those layers now would add indirection without business logic to protect. Keeping all new behavior in `main.py` was rejected because it would mix an emerging product capability with application composition and health reporting.

### Store only the fields required by this slice

Create a `surf_spots` table with an internal integer primary key plus required `name`, `region`, and `country_code` columns. Enforce uniqueness across the three catalog fields and constrain `country_code` to a two-character uppercase value. The internal key is not exposed by this API, so the project does not commit prematurely to a public identifier format.

Coordinates, slugs, provider identifiers, breaks, orientations, and scoring characteristics are omitted until a feature needs them. The API selects only the three public fields and orders them by name and region.

### Return one collection envelope and one stable failure shape

`GET /api/spots` returns `{"spots":[...]}` rather than a bare array, leaving room for future collection metadata without changing the top-level response type. A SQLAlchemy failure is logged without its connection string and translated to HTTP `503` with `{"detail":"Surf spot catalog is unavailable"}`.

The endpoint queries through a concrete SQLAlchemy session dependency. No repository interface is introduced because there is one query and no alternate persistence implementation.

### Apply schema and sample data as separate explicit operations

Create the first Alembic revision for the `surf_spots` table. The revision changes schema only and inserts no catalog rows.

Add a small development seed command that inserts the documented samples `Mundaka — Bizkaia, ES` and `Pantín — A Coruña, ES` when absent. It uses the database uniqueness constraint and a transaction so rerunning it is idempotent. It is invoked only by a dedicated Make target and by `make bootstrap`; normal application startup and `alembic upgrade head` do not seed data.

Add small `migrate` and `seed` Make targets that delegate to commands inside the backend container. `bootstrap` keeps its existing environment-file behavior, starts the stack, applies migrations, and then seeds. Docker and Make remain the only normal host requirements.

### Extend the current Vue screen without introducing frontend architecture

Keep the existing application-status request unchanged. Add a separate catalog state to `App.vue`, start the catalog request on mount, validate the complete response shape, and render loading, populated, empty, or unavailable content in a distinct `Surf spots` section.

A composable, client SDK, state store, router, and component hierarchy are deferred because this is still one screen with one additional request. The two requests remain independent so a catalog failure does not overwrite the application-health message.

### Test behavior at existing boundaries

Backend tests use PostgreSQL to verify the migration-backed query, deterministic ordering, the empty collection, the `503` translation, and idempotent seeding. Test setup owns and removes only rows it creates. Frontend tests mock `fetch` at the HTTP boundary and cover loading, populated, empty, malformed, non-success, and network-failure states while retaining the status tests.

The containerized `make test` workflow applies migrations before backend tests, then runs pytest and Vitest. No new testing dependency is required.

## Risks / Trade-offs

- [The API has no public spot identifier] → This slice only renders a list; add a stable identifier when navigation or cross-resource references require one.
- [A single backend module may grow] → Split it along domain/application/infrastructure boundaries only when real business logic or additional adapters create a concrete separation need.
- [Local seed content could be mistaken for production data] → Keep seeding out of migrations and application startup, name and document the command as development-only, and invoke it only from the local bootstrap workflow.
- [Tests share the local PostgreSQL service] → Use uniquely owned fixtures and cleanup so tests remain deterministic without adding a second database service.
- [The frontend requests status and spots separately] → Keep their states independent; defer aggregation until multiple product requests demonstrate a need.

## Migration Plan

1. Add the SQLAlchemy model and Alembic revision for `surf_spots`.
2. Apply the revision through the containerized migration target before exercising the endpoint.
3. Run the explicit local seed operation during bootstrap.
4. Roll back with the Alembic downgrade, which drops `surf_spots`; local sample rows are removed with the table.

There is no production rollout in this change.
