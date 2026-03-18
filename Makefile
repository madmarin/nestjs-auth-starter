.PHONY: help dev-up dev-build dev-down

COMPOSE := docker compose -f docker-compose.development.yml --env-file .env.development


help:
	@grep -E '^[a-zA-Z0-9_-]+:.*?##' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "%-12s %s\n", $$1, $$2}'

dev-up:
	$(COMPOSE) up

dev-build:
	$(COMPOSE) up --build

dev-down:
	$(COMPOSE) down
