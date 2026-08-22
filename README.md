# alerts.surf

alerts.surf currently contains one small vertical slice that proves the local Vue frontend, FastAPI backend, and PostgreSQL database work together.

## Requirements

Only Docker with Docker Compose is required on the host.

## Configure local development

Create a local environment file from the committed example:

```sh
cp .env.example .env
```

The example values are for local development only. `.env` is ignored by Git and must not contain credentials used by another environment.

## Start the application

Build the images, start all three services, and wait for their health checks:

```sh
docker compose up --detach --build --wait
```

Open <http://localhost:5173>. When the backend and PostgreSQL are healthy, the page displays:

```text
alerts.surf is running
```

The status API is available directly at <http://localhost:8000/api/status> and through the frontend development proxy at <http://localhost:5173/api/status>.

Inspect the running services with:

```sh
docker compose ps
```

## Run checks

Validate the resolved Compose configuration:

```sh
docker compose config --quiet
```

Run the backend tests against the Compose PostgreSQL service:

```sh
docker compose run --rm backend pytest --quiet
```

Verify Alembic can connect without any current migration revision:

```sh
docker compose run --rm backend alembic current
```

Run the frontend type check and tests:

```sh
docker compose run --rm --no-deps frontend bun run type-check
docker compose run --rm --no-deps frontend bun run test
```

## Reproduce the unavailable state

This procedure stops PostgreSQL alone. It deliberately keeps the existing frontend and backend containers running.

1. Start the healthy stack and confirm all three services are healthy:

   ```sh
   docker compose up --detach --build --wait
   docker compose ps
   ```

2. Stop only PostgreSQL:

   ```sh
   docker compose stop db
   ```

3. Confirm the frontend and backend containers are still running:

   ```sh
   docker compose ps frontend backend
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
   docker compose up --detach --wait db
   docker compose ps
   ```

   The page returns to `alerts.surf is running`.

## Stop the application

Stop and remove the containers while preserving the local database volume:

```sh
docker compose down
```

To intentionally remove the local database volume as well:

```sh
docker compose down --volumes
```

## Troubleshooting

Inspect service logs with:

```sh
docker compose logs backend
docker compose logs frontend
docker compose logs db
```

If the page reports that alerts.surf is unavailable, first check `docker compose ps` and the backend/database logs. The API never returns raw database connection details.
