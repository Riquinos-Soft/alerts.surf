## Context

`alerts.surf` now has a production landing page. To enable stakeholders and testers to trial the platform's core domains (Playas, Mareas, Tablas, and Alertas), we need a minimal, reliable authentication layer and an interactive dashboard in the Vue SPA backed by FastAPI.

## Goals / Non-Goals

**Goals:**
- Provide a lightweight authentication flow supporting beta credentials (`userbeta` / `userbeta`).
- Provide an authenticated `GET /api/dashboard/summary` endpoint delivering structured initial data for:
  - **Playas**: Spot name, region, condition score (0-10), swell, wind direction.
  - **Mareas**: Current tide level, rising/falling trend, next high and low tide times.
  - **Tablas**: Registered surfboards with dimensions, volume (L), fin setup, and wave suitability.
  - **Alertas**: Active notification rules and trigger thresholds.
- Add an intuitive login trigger in the landing header and a responsive dashboard interface with tabs for each domain.
- Ensure automated pytest coverage for auth/dashboard endpoints and Vitest coverage for frontend components.

**Non-Goals:**
- User self-registration or email verification in this slice.
- Real-time hardware IoT tide sensor integrations or live third-party buoy API polling (uses clean structured initial telemetry).
- Complex RBAC (Role-Based Access Control) or multi-tenant user management.

## Decisions

### 1. Header-Based Bearer Token for Beta Session
- **Decision**: Authenticate `userbeta` / `userbeta` against configured credentials and return an authorized session token. Protected endpoints validate the `Authorization: Bearer <token>` header.
- **Alternatives considered**:
  - *Full OAuth2 / OIDC*: Adds heavy dependency overhead (JWK validation, token refresh cycles) premature for a beta prototype.
  - *Frontend-only mock*: Fails to validate backend integration and API security boundaries.

### 2. Consolidated Dashboard Summary Endpoint
- **Decision**: Serve `/api/dashboard/summary` as an authenticated GET endpoint returning the four domain datasets in one roundtrip.
- **Alternatives considered**:
  - *Four separate micro-endpoints*: Introduces unnecessary waterfall requests for the initial dashboard render.

### 3. Glassmorphic Modal & Dashboard View Component
- **Decision**: Embed the login modal within `LandingHeader.vue` and render `SurferDashboard.vue` when authenticated. Persist token in browser `sessionStorage` to allow page reloads during testing.
- **Alternatives considered**:
  - *Separate HTML page*: Breaks SPA continuity and Caddy single-origin routing.

## Risks / Trade-offs

- **[Risk]** Hardcoded dummy credentials could accidentally leak into production data.
  - **Mitigation**: Configurable via environment variables with `userbeta` as the fallback default for local/preview environments.
