COMPOSE := docker compose --env-file .env

.PHONY: bootstrap up down logs ps test clean

bootstrap:
	@test -f .env || cp .env.example .env
	$(MAKE) up

up:
	$(COMPOSE) up --detach --build --wait

down:
	$(COMPOSE) down

logs:
	$(COMPOSE) logs --follow

ps:
	$(COMPOSE) ps

test:
	$(COMPOSE) run --rm backend pytest --quiet
	$(COMPOSE) run --rm --no-deps frontend bun run test

clean:
	$(COMPOSE) down --volumes --remove-orphans
