#!/usr/bin/env bash
# Isolated disposable acceptance stack. Never uses the production project/volumes.
set -euo pipefail
export POSTGRES_DB=smoke POSTGRES_USER=smoke POSTGRES_PASSWORD=smoke_test_only
export BETA_USERNAME=smoke_user BETA_PASSWORD=smoke_test_only
export SITE_ADDRESS=http://:80 HTTP_BIND=127.0.0.1 HTTP_PORT=${SMOKE_PORT:-18080} HTTPS_PORT=${SMOKE_TLS_PORT:-18443}
export RELEASE_SHA=${RELEASE_SHA:-smoke}
compose=(docker compose --project-name "alerts-smoke-$$" --env-file /dev/null -f compose.production.yaml)
cleanup() { "${compose[@]}" down --volumes --remove-orphans; }
trap cleanup EXIT
"${compose[@]}" config --quiet
"${compose[@]}" up -d --build --wait --wait-timeout 180
"${compose[@]}" run --rm --no-deps backend alembic upgrade head
curl --fail --silent "http://127.0.0.1:$HTTP_PORT/" | grep -q '<div id="app">'
curl --fail --silent "http://127.0.0.1:$HTTP_PORT/api/status" | grep -q '"database":"ok"'
"${compose[@]}" exec -T db psql -U smoke -d smoke -c 'CREATE TABLE deployment_probe (id int); INSERT INTO deployment_probe VALUES (42);'
"${compose[@]}" stop db
test "$(curl --silent -o /dev/null -w '%{http_code}' "http://127.0.0.1:$HTTP_PORT/api/status")" = 503
test "$("${compose[@]}" ps --status running --services | grep -Ec '^(frontend|backend)$')" = 2
"${compose[@]}" up -d --wait --wait-timeout 180
curl --fail --silent "http://127.0.0.1:$HTTP_PORT/api/status" | grep -q '"database":"ok"'
"${compose[@]}" down
"${compose[@]}" up -d --wait --wait-timeout 180
test "$("${compose[@]}" exec -T db psql -U smoke -d smoke -Atc 'SELECT id FROM deployment_probe')" = 42
echo 'Production smoke checks passed: healthy, degraded, recovery, persistence.'
