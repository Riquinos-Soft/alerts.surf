# alerts.surf

alerts.surf currently contains one small vertical slice that proves the local Vue frontend, FastAPI backend, and PostgreSQL database work together.

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

`make bootstrap` delegates to `make up`, which starts the stack in detached mode and waits for the service health checks.

Open <http://localhost:5173>. When the backend and PostgreSQL are healthy, the page displays:

```text
alerts.surf is running
```

The status API is available directly at <http://localhost:8000/api/status> and through the frontend development proxy at <http://localhost:5173/api/status>.

## Local commands

| Command | Behavior |
| --- | --- |
| `make bootstrap` | Creates `.env` only when absent, then builds and starts the stack. |
| `make up` | Builds and starts the stack in detached mode, waiting for health checks. |
| `make down` | Stops and removes containers and the project network while retaining named volumes. |
| `make logs` | Follows logs from all Compose services until interrupted. |
| `make ps` | Shows the current Compose service status. |
| `make test` | Runs the backend pytest suite and frontend Vitest suite inside containers. |
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

   The page returns to `alerts.surf is running`.

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

If the page reports that alerts.surf is unavailable, first run `make ps` and inspect the backend/database logs. The API never returns raw database connection details.
