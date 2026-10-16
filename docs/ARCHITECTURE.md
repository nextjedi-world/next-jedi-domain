# Architecture

Angular 21, TypeScript, standalone components, plain CSS with custom properties (no UI library),
Material Symbols and Manrope/Inter from Google Fonts. Hosted on Vercel as a static SPA
(`vercel.json` rewrites every path to `index.html`).

Longer design notes live outside this repo in the parent folder `project-structure/`
(`01-architecture.md` to `04-platform-plan.md`). Where they disagree with the code, the code wins.

## Data flow

`apps.config.ts` -> `app.routes.ts` builds routes per app -> shared page components read the app by
`data.appSlug` and render copy from `shared/content/*.content.ts`. `SeoService` sets title and meta
tags per page.

## Observability

- `observability/logger.ts`: structured JSON log records (`level`, `msg`, `ts`, `product`).
- `observability/sentry.ts`: dynamic-imports `@sentry/angular` only when `SENTRY_DSN` was baked in
  at build time by `scripts/build.mjs`. When unset, the Sentry chunk is never requested.
- PostHog analytics is not wired (Linear NEX-1050).

## Deploys

Pushing `master` deploys production on Vercel. PRs should get preview deploys (verification is
tracked in NEX-1063). `make e2e BASE_URL=<url>` smoke-tests a deployment.
