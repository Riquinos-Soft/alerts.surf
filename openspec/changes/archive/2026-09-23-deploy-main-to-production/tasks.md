## 1. Production runtime

- [x] 1.1 Add production images, Compose, Caddy and environment example; verify configuration, backend/frontend tests and frontend type checking.
- [x] 1.2 Add a reproducible isolated production smoke check; verify healthy, database-only outage, recovery and persistence.

## 2. Delivery

- [x] 2.1 Add serialized release deployment with backup, migrations and health verification; verify shell checks and deployment success/failure tests.
- [x] 2.2 Add main-only GitHub delivery after PR/main checks and document setup/recovery; validate workflow and review staged files for secrets.

## 3. Activation

- [x] 3.1 Provision the new VPS and install a preview; verify SSH key access, firewall, private database and HTTP application health.
- [x] 3.2 Configure dedicated deployment credentials in GitHub and publish a focused commit/PR; verify secrets names and remote branch.
- [x] 3.3 After review/merge and DNS cutover, verify the main-triggered pipeline and public HTTPS; record any remaining operator steps.

## Verification record (2026-09-23)

- New OVH host: Docker 29.8.1, Compose installed, OS packages updated and reboot completed, SSH key login verified. Firewall allows TCP 22/80/443; database/backend have no host port bindings.
- Backend 3/3 tests, frontend 5/5 tests, TypeScript and production builds passed. Existing dependency deprecation warnings from Starlette/httpx and AnyIO remain outside this change.
- Deployment 4/4 tests passed, including build/backup/migration/health failure subcases. Shellcheck, actionlint, OpenSpec strict validation and git diff checks passed.
- Isolated production smoke checks passed: HTTP healthy, database-only outage returns 503 with application containers still running, recovery, and persistence through container recreation. Test containers and their disposable volumes were removed.
- Preview revision 13d3cdb369e7cc651d5176b10313ed4e41ad47bf deployed twice successfully; second deployment produced a nonempty pre-migration SQL backup. Browser at http://198.244.233.153 displays `alerts.surf is running`; public API returns healthy.
- PR #8 published and merged to main; GitHub Actions run 35810731720 on main passed and deployed commit 7dcc96e.
- DNS A record cutover to 198.244.233.153 verified (no conflicting AAAA record).
- Production host `/opt/alerts.surf/.env` updated to `SITE_ADDRESS=alerts.surf` and redeployment executed successfully.
- Caddy automatically obtained valid Let's Encrypt TLS certificate for `alerts.surf`.
- Public HTTP (port 80) permanently redirects (308) to HTTPS.
- Public HTTPS (port 443) returns 200 OK for `https://alerts.surf/api/status` (`{"status":"ok","database":"ok"}`) and serves the frontend application.
