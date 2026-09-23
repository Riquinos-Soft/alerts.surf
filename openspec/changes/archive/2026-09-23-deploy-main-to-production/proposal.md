## Why

Publishing main currently does not update alerts.surf. Provide a verified, repeatable production deployment while preserving the other sites on the selected host.

## What Changes

- Check pull requests and main pushes with containerized tests and production builds.
- Deploy the tested main commit through SSH, run migrations, and check health before recording success.
- Provide production containers, persistent private PostgreSQL storage, and Caddy HTTPS termination.
- Keep deployment credentials outside Git and development seed data outside production.
- Deploy on the newly purchased OVH VPS running Ubuntu 26.04 with 8 GB RAM. Leave the old DigitalOcean server and its websites unchanged.

## Capabilities

### New Capabilities

- `production-deployment`: Verified publication of main with isolated runtime configuration and explicit failure reporting.

### Modified Capabilities

None.

## Impact

GitHub Actions, production Dockerfiles/Compose, deployment scripts, and operations documentation. Use the originally planned Caddy on the empty VPS; the previous Nginx exception was only necessary on the old shared host. Do not merge the unrelated open catalog PR. Moving alerts.surf DNS requires access to its DNS provider; do not move any other domains or purchase additional services.
