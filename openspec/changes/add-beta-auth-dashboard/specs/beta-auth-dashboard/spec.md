## Purpose

Provides a lightweight beta authentication flow and an interactive surfer dashboard covering tides, spots, quiver, and session alerts.

## ADDED Requirements

### Requirement: Beta credential authentication
The system SHALL provide an authentication endpoint accepting username and password credentials, returning an authenticated session for beta users, and rejecting invalid attempts with HTTP 401.

#### Scenario: Valid beta credentials
- **WHEN** a user posts credentials with username `userbeta` and password `userbeta` to `/api/auth/login`
- **THEN** the system returns HTTP 200 with an authentication token and user profile

#### Scenario: Invalid credentials
- **WHEN** a user posts invalid username or password to `/api/auth/login`
- **THEN** the system returns HTTP 401 with an authentication failure message

#### Scenario: Logout request
- **WHEN** an authenticated user posts to `/api/auth/logout`
- **THEN** the system terminates the session and returns HTTP 200

### Requirement: Dashboard telemetry summary
The backend SHALL expose an authenticated endpoint `/api/dashboard/summary` returning structured dummy telemetry for spots, tides, quiver boards, and active session alerts.

#### Scenario: Authenticated retrieval
- **WHEN** an authenticated request is made to `/api/dashboard/summary`
- **THEN** the system returns HTTP 200 with arrays for `beaches`, `tides`, `quiver`, and `alerts`

#### Scenario: Unauthenticated access blocked
- **WHEN** a request without valid authentication is made to `/api/dashboard/summary`
- **THEN** the system returns HTTP 401 Unauthorized

### Requirement: Responsive surfer dashboard interface
The frontend SHALL render an interactive dashboard with tabbed navigation for Playas, Mareas, Tablas, and Alertas, and provide a clear logout action.

#### Scenario: Exploring dashboard tabs
- **WHEN** a logged-in user clicks on any domain tab (Playas, Mareas, Tablas, or Alertas)
- **THEN** the dashboard renders the corresponding domain metrics and cards

#### Scenario: Logging out of dashboard
- **WHEN** a user clicks the logout button
- **THEN** the application clears the authenticated session and returns to the public landing page
