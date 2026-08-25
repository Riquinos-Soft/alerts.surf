COMPOSE := docker compose --env-file .env

.PHONY: bootstrap up down logs ps migrate seed test clean

bootstrap:
	@test -f .env || cp .env.example .env
	$(MAKE) up
	$(MAKE) migrate
	$(MAKE) seed

up:
	$(COMPOSE) up --detach --build --wait

down:
	$(COMPOSE) down

logs:
	$(COMPOSE) logs --follow

ps:
	$(COMPOSE) ps

migrate:
	$(COMPOSE) run --rm backend alembic upgrade head

seed:
	$(COMPOSE) run --rm backend python -m app.seed_spots

test:
	$(MAKE) migrate
	$(COMPOSE) run --rm backend pytest --quiet
	$(COMPOSE) run --rm --no-deps frontend bun run test

clean:
	$(COMPOSE) down --volumes --remove-orphans
