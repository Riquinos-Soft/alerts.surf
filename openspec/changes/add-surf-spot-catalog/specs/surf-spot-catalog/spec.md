## Purpose

Provide surfers with a small public catalog of persisted surf spots and a clear frontend state they can use as the starting point for future spot intelligence.

## ADDED Requirements

### Requirement: Backend exposes the persisted surf-spot catalog
The system SHALL expose `GET /api/spots` as a public read-only endpoint that returns each available surf spot with its `name`, `region`, and two-letter uppercase `country_code`, ordered by name and then region.

#### Scenario: Persisted spots are available
- **WHEN** a client requests `GET /api/spots` and the catalog contains spots
- **THEN** the system responds with HTTP `200` and a JSON body containing those spots under a `spots` collection in the defined order

#### Scenario: Catalog is empty
- **WHEN** a client requests `GET /api/spots` and the catalog contains no spots
- **THEN** the system responds with HTTP `200` and `{"spots":[]}`

#### Scenario: Catalog cannot be read
- **WHEN** a client requests `GET /api/spots` and PostgreSQL cannot provide the catalog
- **THEN** the system responds with HTTP `503` and a stable error response that does not expose database credentials or connection details

### Requirement: Frontend presents the surf-spot catalog
The frontend SHALL request `GET /api/spots` when the application screen loads and SHALL display a catalog state derived from the response while preserving the existing application-status behavior.

#### Scenario: Catalog request is in progress
- **WHEN** the frontend has started the catalog request and no response has been received
- **THEN** the surf-spots section displays `Loading surf spots...`

#### Scenario: Catalog contains spots
- **WHEN** the frontend receives a successful response containing one or more valid spots
- **THEN** the surf-spots section displays every returned spot with its name, region, and country code in response order

#### Scenario: Catalog contains no spots
- **WHEN** the frontend receives a successful response containing an empty `spots` collection
- **THEN** the surf-spots section displays `No surf spots available`

#### Scenario: Catalog is unavailable
- **WHEN** the catalog request fails, returns a non-success response, or contains an invalid payload
- **THEN** the surf-spots section displays `Surf spots are unavailable`

### Requirement: Local development provides repeatable sample spots
The project SHALL provide deterministic sample surf spots for local development through an explicit development-only seed operation that is included in the documented bootstrap workflow.

#### Scenario: Developer bootstraps a fresh local database
- **WHEN** a developer runs the documented bootstrap workflow against a fresh local database
- **THEN** at least one documented sample spot is available through `GET /api/spots` and visible in the frontend

#### Scenario: Developer repeats local bootstrap
- **WHEN** the development seed operation runs more than once against the same local database
- **THEN** the catalog contains no duplicate sample spots

#### Scenario: Schema migration runs without development seeding
- **WHEN** database migrations run without the explicit development seed operation
- **THEN** the schema is prepared but no sample spots are inserted
