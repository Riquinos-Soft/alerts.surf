#!/usr/bin/env bash
set -euo pipefail
umask 077

revision=${1:?Usage: deploy.sh FULL_COMMIT_SHA}
[[ $revision =~ ^[0-9a-f]{40}$ ]] || { echo 'Invalid commit SHA' >&2; exit 1; }
root=${DEPLOY_ROOT:-/opt/alerts.surf}
release="$root/releases/$revision"
test -f "$root/.env"
test -f "$release/compose.production.yaml"
cd "$release"
exec 9>"$root/deploy.lock"
flock -w 600 9
export RELEASE_SHA="$revision"
compose=(docker compose --project-name alerts-surf-production --env-file "$root/.env" -f "$release/compose.production.yaml")
"${compose[@]}" config --quiet
# Build before changing the running services.
"${compose[@]}" build --pull
"${compose[@]}" up -d --wait --wait-timeout 120 db
mkdir -p "$root/backups"
if test -L "$root/current"; then
    backup="$root/backups/$(date -u +%Y%m%dT%H%M%S)-$revision.sql"
    # Expand database settings inside the container, not on the host.
    # shellcheck disable=SC2016
    "${compose[@]}" exec -T db sh -c 'pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB"' > "$backup.partial"
    test -s "$backup.partial"
    mv "$backup.partial" "$backup"
fi
"${compose[@]}" run --rm --no-deps backend alembic upgrade head
"${compose[@]}" up -d --wait --wait-timeout 180
"${compose[@]}" exec -T frontend wget -q -O /dev/null http://127.0.0.1:8080/api/status
ln -sfn "$release" "$root/current.next"
mv -Tf "$root/current.next" "$root/current"
echo "Successfully deployed $revision"
