// Smoke test for a deployed nextjedi.com build: each path must answer 200 with the Angular shell.
// Usage: make e2e BASE_URL=https://<preview>.vercel.app
const base = (process.env.BASE_URL ?? '').replace(/\/$/, '');
if (!base) {
  console.error('BASE_URL is not set. Example: make e2e BASE_URL=https://nextjedi.com');
  process.exit(1);
}
const paths = [
  '/',
  '/team',
  '/terms',
  '/contact',
  '/mindful-journal/privacy',
  '/mindful-journal/delete-account',
];
let failed = 0;
for (const path of paths) {
  const url = base + path;
  try {
    const res = await fetch(url, { redirect: 'follow' });
    const body = await res.text();
    const ok = res.status === 200 && body.includes('<app-root');
    console.log(`${ok ? 'ok  ' : 'FAIL'} ${res.status} ${url}`);
    if (!ok) failed++;
  } catch (err) {
    console.log(`FAIL ${url}: ${err instanceof Error ? err.message : String(err)}`);
    failed++;
  }
}
process.exit(failed ? 1 : 0);
