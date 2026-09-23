## 1. Production runtime

- [x] 1.1 Add production images, Compose, Caddy and environment example; verify configuration, backend/frontend tests and frontend type checking.
- [x] 1.2 Add a reproducible isolated production smoke check; verify healthy, database-only outage, recovery and persistence.

## 2. Delivery

- [x] 2.1 Add serialized release deployment with backup, migrations and health verification; verify shell checks and deployment success/failure tests.
- [x] 2.2 Add main-only GitHub delivery after PR/main checks and document setup/recovery; validate workflow and review staged files for secrets.

## 3. Activation

- [ ] 3.1 Provision the new VPS and install a preview; verify SSH key access, firewall, private database and HTTP application health.
- [ ] 3.2 Configure dedicated deployment credentials in GitHub and publish a focused commit/PR; verify secrets names and remote branch.
- [ ] 3.3 After review/merge and DNS cutover, verify the main-triggered pipeline and public HTTPS; record any remaining operator steps.
