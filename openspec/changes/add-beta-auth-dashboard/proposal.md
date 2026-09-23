## Why

With the public landing page in place, `alerts.surf` needs a minimal, functional authentication gate and application dashboard for early beta users. This allows testers to log in and interact with the four foundational pillars of the surf platform—Tides (Mareas), Spots (Playas), Quiver/Boards (Tablas), and Alerts (Alertas)—using lightweight beta credentials (`userbeta` / `userbeta`) while keeping the public landing page accessible.

## What Changes

- **Backend Authentication & Dashboard API (FastAPI)**:
  - Introduce `POST /api/auth/login` validating beta credentials (`userbeta` / `userbeta`) and returning an authenticated session.
  - Introduce `POST /api/auth/logout` clearing the session.
  - Introduce `GET /api/dashboard/summary` serving structured beta telemetry and dummy data for the four core domains:
    - **Playas (Spots)**: Local breaks, current ratings, swell and wind summaries.
    - **Mareas (Tides)**: High/low tide schedule, current level, and tidal trend.
    - **Tablas (Quiver)**: User surfboards (model, length, volume, fin configuration, and ideal condition matching).
    - **Alertas (Alerts)**: Configured condition alert rules and status.
- **Frontend Beta Login & Dashboard (Vue 3)**:
  - Add an accessible "Sign In / Entrar" button in the public header navigating to the login interface.
  - Render an authenticated, responsive Surfer Dashboard with unified navigation tabs across Playas, Mareas, Tablas, and Alertas.
  - Provide a clean Logout button that resets the session and returns to the public landing page.

## Capabilities

### New Capabilities
- `beta-auth-dashboard`: Authentication flow and surfer dashboard presenting spots, tides, quiver boards, and session alerts.

### Modified Capabilities
<!-- None: public landing and system health (/api/status) continue operating unchanged. -->

## Impact

- **Backend**: Adds auth and dashboard routers in `backend/app/`, backed by unit tests with pytest.
- **Frontend**: Adds `frontend/src/components/dashboard/` and login modal/view in Vue, with tests in Vitest.
- **Dependencies**: Zero new external packages; uses existing FastAPI, Pydantic, and Vue 3 reactive state.
