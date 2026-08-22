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
