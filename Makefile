# Repo contract (nextjedi-world/platform docs/CONTRACTS.md):
#   make setup   install dependencies and git hooks
#   make dev     run locally (http://localhost:4200) against local Identity :4000 + platform-api :4100
#   make dev-mock  run locally with platform-api and sign-in mocked in the browser
#   make verify  lint + format check + typecheck + unit tests + build (what CI and the Stop hook run)
#   make e2e     smoke test a deployed site: make e2e BASE_URL=https://<preview>.vercel.app
.DEFAULT_GOAL := verify
.PHONY: setup dev dev-mock docker-prod docker-stop verify lint format format-check typecheck test build e2e clean

BASE_URL ?=
export BASE_URL
export NG_CLI_ANALYTICS := false
export NEXTJEDI_PRODUCT := next-jedi-domain

setup:
	npm ci
	node scripts/install-hooks.mjs

dev:
	npm start

dev-mock:
	npx ng serve --configuration mock

# Site in Docker against the production backend, at https://nextjedi.tail7ddaf8.ts.net:4443 (tailnet only).
docker-prod:
	docker build -t nextjedi-web:azure .
	docker rm -f nextjedi-web 2>/dev/null || true
	docker run -d --name nextjedi-web -p 127.0.0.1:4280:80 nextjedi-web:azure
	tailscale serve --bg --https=4443 http://127.0.0.1:4280

docker-stop:
	tailscale serve --https=4443 off || true
	docker rm -f nextjedi-web 2>/dev/null || true

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
