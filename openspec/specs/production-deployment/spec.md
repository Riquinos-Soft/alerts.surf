# production-deployment Specification

## Purpose
Publish verified main revisions of alerts.surf on a single production server with persistent data and explicit deployment failure reporting.

## Requirements

### Requirement: Only verified main revisions deploy automatically
The delivery process SHALL test backend and frontend behavior, type-check and build the frontend, and verify the production stack before automatically deploying a main revision. Pull requests SHALL NOT receive production credentials or deploy.

#### Scenario: Main checks pass
- **WHEN** a main push passes all required checks
- **THEN** the deployment uses that exact commit and reports success only after health verification

#### Scenario: Checks fail or a pull request runs
- **WHEN** checks fail or the event is a pull request
- **THEN** no production deployment occurs

### Requirement: Public application and private persistent data
The production application SHALL serve its frontend and API on the same origin, expose only web ports publicly, and retain database data across deployments. Production secrets SHALL remain outside version control.

#### Scenario: Healthy production stack
- **WHEN** frontend, backend and database are healthy
- **THEN** the public status endpoint returns healthy and the frontend displays the running state

#### Scenario: Database outage
- **WHEN** only PostgreSQL stops while the frontend and backend remain running
- **THEN** the status endpoint returns HTTP 503 and recovery succeeds when PostgreSQL restarts

#### Scenario: Domain activation
- **WHEN** alerts.surf DNS points to the new VPS and domain configuration is activated
- **THEN** the application is available over publicly trusted HTTPS

### Requirement: Deployment failure preserves recovery information
Deployments SHALL run sequentially, execute migrations before application activation, preserve a database backup before migrations on an existing installation, and retain the last successful release reference until the new release is healthy.

#### Scenario: Migration or health check fails
- **WHEN** migration or health verification fails
- **THEN** deployment fails visibly and the last successful release reference and existing data remain available for operator recovery

#### Scenario: Repeated deployment
- **WHEN** the same revision is deployed again
- **THEN** configuration and persistent data are preserved and health is checked again
