# Repo contract (nextjedi/platform docs/CONTRACTS.md):
#   make setup   install dependencies and git hooks
#   make dev     run locally (http://localhost:4200)
#   make verify  lint + format check + typecheck + unit tests + build (what CI and the Stop hook run)
#   make e2e     smoke test a deployed site: make e2e BASE_URL=https://<preview>.vercel.app
.DEFAULT_GOAL := verify
.PHONY: setup dev verify lint format format-check typecheck test build e2e clean

BASE_URL ?=
export BASE_URL
export NG_CLI_ANALYTICS := false
export NEXTJEDI_PRODUCT := next-jedi-domain

setup:
	npm ci
	node scripts/install-hooks.mjs

dev:
	npm start

lint:
	npm run lint

format:
	npm run format

format-check:
	npm run format:check

typecheck:
	npm run typecheck

test:
	npm test

build:
	npm run build

verify: lint format-check typecheck test build

e2e:
	node scripts/smoke.mjs

clean:
	node -e "for (const d of ['dist','.angular','coverage']) require('fs').rmSync(d, { recursive: true, force: true })"
