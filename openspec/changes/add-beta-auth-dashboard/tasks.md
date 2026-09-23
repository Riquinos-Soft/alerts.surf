## 1. Backend Authentication and Dashboard API

- [ ] 1.1 Implement `backend/app/auth.py` with `POST /api/auth/login` and `POST /api/auth/logout`, verifying `userbeta` / `userbeta` credentials and issuing bearer token; add pytest test for valid/invalid login.
- [ ] 1.2 Implement `backend/app/dashboard.py` with `GET /api/dashboard/summary` delivering structured data for beaches, tides, quiver, and alerts; add pytest test asserting authenticated payload and unauthenticated 401 error.

## 2. Frontend Auth State and Login Dialog

- [ ] 2.1 Add authentication state management and `LoginModal.vue` in `frontend/src/components/auth/`; verify Vitest test asserts credential submission and error message on failed login.
- [ ] 2.2 Add "Sign In / Entrar" button in `LandingHeader.vue` and integrate login trigger; verify Vitest test asserts modal opening and button state.

## 3. Surfer Dashboard Interface

- [ ] 3.1 Implement `frontend/src/components/dashboard/SurferDashboard.vue` with tabbed views for Playas, Mareas, Tablas, and Alertas, and a clean logout action; verify Vitest test asserts rendering of all four domain tabs.
- [ ] 3.2 Wire dashboard view into `App.vue` based on session state and test full login-to-dashboard-to-logout flow in `App.test.ts`; verify all Vitest tests pass.

## 4. Verification and Validation

- [ ] 4.1 Run backend pytest, frontend Vitest, type-check, and build; verify zero test failures or lint issues.
- [ ] 4.2 Run `openspec validate --all --strict` and inspect git diff to ensure no out-of-scope files or credentials were introduced.
