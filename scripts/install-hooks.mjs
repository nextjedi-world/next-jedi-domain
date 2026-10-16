// Installs the lefthook git hooks. Runs from `npm install` (prepare) and `make setup`.
// Skipped in CI, on Vercel and outside a git checkout so builds never fail on it.
import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';

if (process.env.CI || process.env.VERCEL || !existsSync('.git')) {
  process.exit(0);
}
try {
  execSync('npx --no-install lefthook install', { stdio: 'inherit' });
} catch {
  console.warn('lefthook: hooks not installed (run `npx lefthook install` by hand)');
}
