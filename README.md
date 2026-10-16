# nextjedi.com

The NextJedi portfolio site: Angular 21 SPA on Vercel. App landing pages, privacy, support,
marketing and account-deletion pages for each NextJedi app.

```bash
make setup   # npm ci + git hooks
make dev     # http://localhost:4200
make verify  # lint + format check + typecheck + unit tests + build (what CI runs)
```

See [CLAUDE.md](./CLAUDE.md) for layout and rules, and [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md).
Pushing to `master` deploys to production.
