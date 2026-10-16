# next-jedi-domain

Product id: `next-jedi-domain` (`NEXTJEDI_PRODUCT`). The nextjedi.com portfolio site: Angular 21 SPA
(standalone components, no NgModules, plain CSS) on Vercel. Repo `nextjedi/next-jedi-domain`,
default branch **`master`**. **Pushing to `master` deploys to production.** Built on the NextJedi
Studio Platform (`nextjedi-world/platform`).

## Commands

| Task                                | Command                                                                           |
| ----------------------------------- | --------------------------------------------------------------------------------- |
| Install deps and git hooks          | `make setup`                                                                      |
| Run locally (http://localhost:4200) | `make dev`                                                                        |
| Everything CI checks                | `make verify`                                                                     |
| Lint / format / typecheck           | `make lint`, `make format`, `make typecheck`                                      |
| Unit tests (vitest via `ng test`)   | `make test`, or `npx ng test --watch=false --include src/app/seo.service.spec.ts` |
| Production build                    | `make build` (output `dist/nextjedi-app-portfolio/browser`)                       |
| Smoke test a deployed build         | `make e2e BASE_URL=https://<preview>.vercel.app`                                  |

`make verify` = eslint + prettier check + `tsc` (app and spec) + unit tests + production build. It is
what CI and the Stop hook run. Do not finish a task while it fails. Node 22 (`.nvmrc`).

## Layout

- `src/app/apps.config.ts`: the single source of truth for every app (slug, stores, features).
- `src/app/app.routes.ts`: routes. Apps without a custom page get the generic `AppPage` plus
  `/privacy-policy`, `/support`, `/marketing` sub-pages from `apps.config.ts`.
- `src/app/shared/`: reusable page templates; `shared/content/*.content.ts` holds the legal,
  privacy, support, marketing and delete-account copy per app.
- `src/app/observability/`: structured `log` and the Sentry init (off unless `SENTRY_DSN` is set).
- `scripts/`: `build.mjs` (build with env baked in), `smoke.mjs` (`make e2e`), `install-hooks.mjs`.
- `vercel.json`: SPA rewrite and output directory. Do not change Vercel project settings or DNS
  without Arunabh's go.
- Sibling folders outside this repo (`../aurora-backend`, `../project-structure`) are not in git here.
  More detail: `docs/ARCHITECTURE.md`.

## Rules

- Standalone components only. Use built-in control flow (`@if`, `@for`).
- Adding an app: add it to `apps.config.ts`; the routes follow. Store links must be real.
- Store listings link to `/<app>/privacy` and `/<app>/delete-account` for some apps (Play requires
  a web deletion URL); keep those paths stable.
- Unit tests sit next to code as `*.spec.ts`; vitest globals are on.
- Every change maps to a Linear issue (team NEX). Branch names come from Linear; PR body has
  `Fixes NEX-123`. Conventional commits (`feat:`, `fix:`, `chore:`); the commit-msg hook enforces it.
- Never commit secrets. Names of env vars live in `.env.example`; values live in Vercel.
- Errors: `SENTRY_DSN` (build-time) turns Sentry on; unset is a no-op. Log with `log.*` from
  `src/app/observability/logger.ts`, not bare `console`.
- Login, payments and the AWS API are tracked in Linear (NEX-66..93), not wired in this repo yet.

## CI

`.github/workflows/ci.yml` runs `make verify` on Node 22; `commitlint.yml` checks the PR title and the
`Fixes NEX-123` line. Both are self-contained because this repo is public and `nextjedi-world/platform` is
private, so its reusable workflows (`ci-web.yml`, `claude-review.yml`) cannot be called from here.
Keep ci.yml in line with `ci-web.yml`. Renovate keeps dependencies current; release-please cuts releases.
