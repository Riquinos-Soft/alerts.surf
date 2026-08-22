## Purpose

Provide a minimal end-to-end indication that the locally running alerts.surf frontend, backend, and database can communicate successfully.

## ADDED Requirements

### Requirement: Backend reports application and database status
The system SHALL expose `GET /api/status` and SHALL determine the application status by attempting a PostgreSQL connectivity check for each request.

#### Scenario: Backend and database are available
- **WHEN** a client requests `GET /api/status` and the backend completes the database connectivity check
- **THEN** the system responds with HTTP `200` and a JSON body containing `{"status":"ok","database":"ok"}`

#### Scenario: Database is unavailable
- **WHEN** a client requests `GET /api/status` and the backend cannot complete the database connectivity check
- **THEN** the system responds with HTTP `503` and a JSON body containing `{"status":"unavailable","database":"unavailable"}`

### Requirement: Frontend presents the integrated application status
The frontend SHALL request `GET /api/status` when the application screen loads and SHALL present a minimal visible state derived from the response.

#### Scenario: Status check is in progress
- **WHEN** the frontend has started the status request and no response has been received
- **THEN** the page displays `Checking alerts.surf status...`

#### Scenario: Integrated application is healthy
- **WHEN** the frontend receives a successful status response with both status values set to `ok`
- **THEN** the page displays `alerts.surf is running`

#### Scenario: Integrated application is unavailable
- **WHEN** the status request fails, returns a non-success response, or does not report both status values as `ok`
- **THEN** the page displays `alerts.surf is unavailable`

### Requirement: Local stack runs as one integrated slice
The project SHALL provide a Docker Compose workflow that starts the frontend, backend, and PostgreSQL services with the configuration needed for them to communicate locally.

#### Scenario: Developer starts a healthy local stack
- **WHEN** a developer starts the documented Docker Compose workflow and all three services become healthy
- **THEN** opening the documented frontend URL displays `alerts.surf is running`

#### Scenario: Database loses availability in the local stack
- **WHEN** the frontend and backend remain reachable but PostgreSQL is unavailable
- **THEN** the status API and frontend expose the unavailable behavior defined by this capability

### Requirement: Root Makefile provides a stable local workflow
The project SHALL provide a small root `Makefile` whose commands delegate to Docker Compose and existing containerized project tooling, so the normal local workflow requires Docker with Compose and Make but does not require host Python or Bun.

#### Scenario: Developer builds and starts the stack
- **WHEN** a configured developer runs `make up`
- **THEN** the frontend, backend, and PostgreSQL images are built and the stack starts in detached mode with health readiness applied

#### Scenario: Developer stops the stack without deleting data
- **WHEN** a developer runs `make down`
- **THEN** the project services stop and their containers and network are removed while project named volumes are retained

#### Scenario: Developer inspects the stack
- **WHEN** a developer runs `make ps` or `make logs`
- **THEN** the command respectively displays current Compose service status or follows the Compose service logs until interrupted

#### Scenario: Developer runs all automated tests
- **WHEN** a developer runs `make test`
- **THEN** the backend pytest suite and frontend Vitest suite run through containers without requiring host Python or Bun

#### Scenario: Developer removes local project state
- **WHEN** a developer runs `make clean`
- **THEN** the stack stops and project containers, orphaned containers, networks, and named volumes are removed

#### Scenario: Developer bootstraps a fresh checkout
- **WHEN** `.env` does not exist and a developer runs `make bootstrap`
- **THEN** `.env` is created from `.env.example` and the behavior of `make up` is performed

#### Scenario: Developer bootstraps with existing local configuration
- **WHEN** `.env` already exists and a developer runs `make bootstrap`
- **THEN** the existing `.env` remains byte-for-byte unchanged and the behavior of `make up` is performed

### Requirement: Local configuration and ignore rules are safe to version
The project SHALL version `.env.example` as local configuration documentation and SHALL ignore populated local environment files, operating-system metadata, Python caches and virtual environments, Node/Bun dependencies and build artifacts, and common local IDE files.

#### Scenario: Local-only files are excluded
- **WHEN** Git evaluates `.DS_Store`, `.env`, Python cache or virtual-environment files, Node/Bun dependency or build directories, and common IDE-local files
- **THEN** those files are ignored while `.env.example` remains eligible for version control

#### Scenario: Project configuration remains eligible for version control
- **WHEN** Git evaluates `AGENTS.md`, `openspec/`, `.agents/`, `bun.lock`, `compose.yaml`, `Makefile`, and other project configuration
- **THEN** those paths are not excluded by the project ignore rules
