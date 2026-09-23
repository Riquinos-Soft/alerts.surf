# Production operations

Single OVH VPS, Ubuntu 26.04 x86_64, Docker Engine and Compose from Docker's official apt repository. No changes to the old DigitalOcean server. Only TCP 22, 80 and 443 are public; Docker only publishes the frontend web ports (published Docker ports bypass UFW).

## Setup

1. Install Docker following https://docs.docker.com/engine/install/ubuntu/ and enable its systemd service. Apply OS security updates. Allow SSH before enabling the firewall.
2. Create an `alerts-deploy` Unix user with a locked password, Docker group membership, and `/opt/alerts.surf` ownership. Docker membership is root-equivalent. Install a dedicated GitHub deployment public key in its authorized_keys with `restrict`; do not reuse the developer's private key. Keep the administrator's SSH key separately.
3. Copy `deploy/.env.example` to `/opt/alerts.surf/.env` with mode 600 and deployment-user ownership. Generate a URL-safe random hex database password. Do not change database credentials casually after initialization. Do not put RELEASE_SHA in this file; deployment supplies it.
4. GitHub production environment: secrets `DEPLOY_SSH_KEY`, `DEPLOY_KNOWN_HOSTS`; repository variables `DEPLOY_HOST`, `DEPLOY_USER`. Verify the host key independently (OVH console or a previously verified connection), not with blind ssh-keyscan during CI. Limit the production environment to main.
5. Before DNS cutover set `SITE_ADDRESS=http://198.244.233.153`. Once the alerts.surf A record points to the VPS, set `SITE_ADDRESS=alerts.surf` and redeploy. Remove/correct any conflicting AAAA record. Caddy obtains and renews TLS automatically. No domain registration transfer is needed. Other domains stay unchanged.

## Delivery and checks

PRs and main run `bash deploy/check.sh`: pytest, Vitest, TypeScript, deployment tests, production build and isolated healthy/degraded/recovery/persistence checks. Requires Linux, Docker Compose, Bash, Python 3, curl and flock. Smoke checks use disposable project-specific volumes and ports 18080/18443; set SMOKE_PORT/SMOKE_TLS_PORT if occupied. Never use production credentials for tests.

After merge, main deploys the exact checked revision. Concurrent deployments serialize; obsolete queued revisions skip. Manual workflow dispatch is allowed only from main. No app secrets are available to the checks job. Do not use pull_request_target for this workflow.

Release layout: `/opt/alerts.surf/releases/<commit>`, `.env`, `backups/`, `incoming/`, and `current` (last successful release). Source archives contain tracked files only. Alembic runs without seed data. Builds precede restart; migrations run before application activation. Deployment is not zero-downtime.

For a manual retry, as the deploy user:

```sh
bash /opt/alerts.surf/releases/FULL_COMMIT_SHA/deploy/deploy.sh FULL_COMMIT_SHA
```

Verify `curl --fail https://alerts.surf/api/status`, open the frontend in a browser, and check the successful GitHub run. Before DNS, use `http://198.244.233.153` instead; this is only a preview, not HTTPS acceptance.

## Failure and recovery

A failed build, backup, migration or health check fails the workflow. `current` stays on the last healthy release, but containers or schema may have changed; it is not an automatic rollback. Inspect Compose logs for the attempted release using its RELEASE_SHA, the production env file and `--project-name alerts-surf-production`.

If the schema remains compatible, rerun the previous release's deploy script with its SHA. If not, stop application writes and assess the pre-migration SQL backup before restoring into a separately validated database. Never run automatic Alembic downgrade or `docker compose down --volumes` in production. Restoration can lose writes made since the backup; obtain owner approval first.

Pre-deployment backups and old images/releases consume disk; monitor `df -h` and `docker system df` and retain the active and previous releases. No automatic pruning is configured. Copy database backups off-host and test restore periodically: on-host dumps alone do not survive server loss. OVH backup availability/retention must be checked in the account.

The administrator password was shared during setup; change it privately with `passwd`. Key login is configured separately. Do not disable password recovery until the owner has verified key access and OVH console recovery.
