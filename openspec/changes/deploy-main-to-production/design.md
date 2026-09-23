## Context

See proposal.md for motivation. Main contains only the application status slice; the catalog PR is not merged. The user purchased an empty Ubuntu 26.04 x86_64 OVH VPS (8 GB RAM) and authorized setup. The former DigitalOcean host is not modified.

## Goals / Non-Goals

**Goals:** Reproducible single-host deployment of the tested main revision, private persistent database, same-origin frontend/API, HTTPS once DNS points to the VPS.

**Non-Goals:** Migrating existing websites or mail, new product functionality, high availability, automatic database downgrade, merging the unrelated catalog change.

## Decisions

- Separate production Compose and Dockerfiles preserve the existing local workflow. Compile Vue with Bun; serve static files and proxy /api through Caddy. FastAPI runs without reload as a non-root user. PostgreSQL and backend have no published ports.
- Use the originally selected Caddy rather than installing host Nginx on this empty server. Domain and ports come from environment variables. Temporary HTTP-by-IP permits acceptance testing before DNS; switch to the real domain for automatic TLS afterwards.
- GitHub Actions runs tests, type checks, and production smoke tests on PRs and main. Deployment only runs for main, after checks, through a dedicated SSH key and pinned known_hosts. Serialize deployments without cancellation during migrations.
- Ship a tracked source archive of the exact tested commit to /opt/alerts.surf/releases. Build on the server, using commit-specific image tags. Persist configuration outside releases in a mode-600 .env. Run Alembic upgrade head before restarting the application; do not seed production.
- The host deploy script uses flock, preserves the previous successful release, dumps PostgreSQL before upgrading existing installations, and only updates the current symlink after health checks. Failures exit nonzero. Recovery is explicit using a previous release; incompatible migrations require operator assessment and database restoration, never automatic downgrade.
- Install a dedicated deployment SSH key for GitHub; do not upload the developer's private key. The deployment user has Docker access (root-equivalent), so restrict key forwarding and keep repository/environment access controlled.

## Risks / Trade-offs

- Single host and in-place restart mean brief downtime → document this instead of adding orchestration.
- Database migrations can outlive a failed deployment → backup first, preserve release history, manual recovery with write-loss assessment.
- Daily VPS backup is not an independent database backup → retain pre-deployment dumps, document off-host copies as a remaining operations requirement.
- DNS still points to the old host → validate via IP first, then require DNS update before claiming HTTPS or full activation.

## Migration Plan

Provision Docker and firewall on the new host, validate deployment containers independently, configure SSH and GitHub secrets, install the tested revision for preview, then publish via a focused PR. After merge and DNS update, verify a successful main-triggered deployment and public HTTPS. Keep the old host unchanged.
