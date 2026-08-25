# alerts.surf

alerts.surf currently contains two small vertical slices: integrated application health and a public read-only catalog of surf spots persisted in PostgreSQL.

## Requirements

The normal local workflow requires:

- Docker with a current Docker Compose v2 plugin.
- Make with POSIX shell semantics.

Python and Bun run inside containers and are not required on the host. On native Windows, use an environment such as WSL that provides Make and POSIX command semantics.

## Start the application

Prepare the local environment, build the images, and start all three services:

```sh
make bootstrap
```

On the first run, this copies `.env.example` to `.env`. It never overwrites an existing `.env`. The example values are for local development only; `.env` is ignored by Git and must not contain credentials used by another environment.

`make bootstrap` starts the stack, applies database migrations, and loads deterministic development-only sample spots. Running it again preserves `.env` and does not duplicate sample data.

Open <http://localhost:5173>. When the backend and PostgreSQL are healthy, the page displays:

```text
alerts.surf is running
```

The same screen displays the local surf-spot catalog with Mundaka and Pantín. The APIs are available directly at <http://localhost:8000/api/status> and <http://localhost:8000/api/spots>, and through the frontend development proxy under the same `/api` paths at <http://localhost:5173>.

## Local commands

| Command | Behavior |
| --- | --- |
| `make bootstrap` | Creates `.env` only when absent, starts the stack, applies migrations, and loads development sample spots idempotently. |
| `make up` | Builds and starts the stack in detached mode, waiting for health checks. |
| `make down` | Stops and removes containers and the project network while retaining named volumes. |
| `make logs` | Follows logs from all Compose services until interrupted. |
| `make ps` | Shows the current Compose service status. |
| `make migrate` | Applies all pending Alembic migrations through the backend container. |
| `make seed` | Idempotently loads the development-only Mundaka and Pantín samples. |
| `make test` | Applies migrations, then runs the backend pytest and frontend Vitest suites inside containers. |
| `make clean` | Stops the stack and removes project containers, orphaned containers, networks, and named volumes. |

`make clean` is destructive: it removes the local PostgreSQL data volume. Use `make down` for the normal volume-preserving shutdown.

## Run checks

Run both automated test suites:

```sh
make test
```

Additional focused checks remain available through the containerized tooling:

```sh
docker compose --env-file .env config --quiet
docker compose --env-file .env run --rm backend alembic current
docker compose --env-file .env run --rm --no-deps frontend bun run type-check
```

## Surf spot catalog

The catalog is public and read-only. A successful request returns spots ordered by name and region:

```sh
curl http://localhost:8000/api/spots
```

After local bootstrap, the response is:

```json
{"spots":[{"name":"Mundaka","region":"Bizkaia","country_code":"ES"},{"name":"Pantín","region":"A Coruña","country_code":"ES"}]}
```

Schema migrations never insert sample content. `make seed` is the explicit development-only operation and can be repeated safely. To recreate the complete local database from scratch, run:

```sh
make clean
make bootstrap
```

`make clean` deletes the local PostgreSQL volume; do not use it when you need to preserve local data.

## Reproduce the unavailable state

This procedure stops PostgreSQL alone. It deliberately keeps the existing frontend and backend containers running.

1. Start the healthy stack and confirm all three services are healthy:

   ```sh
   make up
   make ps
   ```

2. Stop only PostgreSQL:

   ```sh
   docker compose --env-file .env stop db
   ```

3. Confirm the frontend and backend containers are still running:

   ```sh
   docker compose --env-file .env ps frontend backend
   ```

   The backend may become `unhealthy` because its status endpoint now returns `503`, but its container remains running.

4. Verify the degraded API response directly and through the Vite proxy:

   ```sh
   curl --include http://localhost:8000/api/status
   curl --include http://localhost:5173/api/status
   ```

   Both requests return HTTP `503` with:

   ```json
   {"status":"unavailable","database":"unavailable"}
   ```

5. Open or refresh <http://localhost:5173>. Because the status check runs when the screen loads, refreshing makes the page display:

   ```text
   alerts.surf is unavailable
   ```

6. Start PostgreSQL again without recreating the frontend or backend, wait for database health, and refresh the browser:

   ```sh
   docker compose --env-file .env up --detach --wait db
   make ps
   ```

   The page returns to `alerts.surf is running` and displays the surf-spot catalog again.

## Stop the application

Stop and remove the containers while preserving the local database volume:

```sh
make down
```

To intentionally remove all project volumes, including local PostgreSQL data:

```sh
make clean
```

## Troubleshooting

Follow all service logs with:

```sh
make logs
```

For one service at a time, use Compose directly:

```sh
docker compose --env-file .env logs backend
docker compose --env-file .env logs frontend
docker compose --env-file .env logs db
```

If the page reports that alerts.surf or the surf-spot catalog is unavailable, first run `make ps` and inspect the backend/database logs. Run `make migrate` if the database schema has not been prepared. The APIs never return raw database connection details.
