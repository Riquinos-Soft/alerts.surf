#!/usr/bin/env bash
set -euo pipefail
export POSTGRES_DB=checks POSTGRES_USER=checks POSTGRES_PASSWORD=checks_only
compose=(docker compose --project-name "alerts-check-$$" --env-file /dev/null -f compose.yaml)
trap '"${compose[@]}" down --volumes --remove-orphans' EXIT
"${compose[@]}" build
"${compose[@]}" up -d --wait db
"${compose[@]}" run --rm --no-deps backend pytest -q
"${compose[@]}" run --rm --no-deps frontend bun run test
"${compose[@]}" run --rm --no-deps frontend bun run type-check
python3 -m unittest discover -s deploy/tests -v
bash -n deploy/check.sh deploy/deploy.sh deploy/smoke.sh
bash deploy/smoke.sh
