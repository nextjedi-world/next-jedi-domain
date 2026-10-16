// Production build. Bakes SENTRY_DSN / SENTRY_ENVIRONMENT (from the environment) into the bundle
// with `ng build --define`. Both default to '' in angular.json, so unset = Sentry stays off.
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const dsn = process.env.SENTRY_DSN ?? '';
const environment =
  process.env.SENTRY_ENVIRONMENT || (process.env.VERCEL_ENV === 'production' ? 'prod' : 'dev');
const ngBin = fileURLToPath(new URL('../node_modules/@angular/cli/bin/ng.js', import.meta.url));
const args = [
  ngBin,
  'build',
  `--define=SENTRY_DSN=${JSON.stringify(dsn)}`,
  `--define=SENTRY_ENVIRONMENT=${JSON.stringify(environment)}`,
  ...process.argv.slice(2),
];
const res = spawnSync(process.execPath, args, { stdio: 'inherit' });
if (res.error) {
  console.error(res.error);
}
process.exit(res.status ?? 1);
