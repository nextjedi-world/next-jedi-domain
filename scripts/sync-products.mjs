// Upserts one `products` row per entry in src/app/products.config.ts.
// Default is a DRY RUN (prints the rows). Pass --apply to write; needs SUPABASE_URL and
// SUPABASE_SERVICE_ROLE_KEY. Requires Node 22.18+ (runs the .ts config via type stripping).
// The products table itself is created by migrations (NEX-72), not here.
import { PRODUCTS } from '../src/app/products.config.ts';

const apply = process.argv.includes('--apply');

export function toRows(products) {
  return products.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    amount_paise: p.amount_paise,
    currency: p.currency,
    kind: p.kind,
    app_slug: p.appSlug ?? null,
  }));
}

const rows = toRows(PRODUCTS);

if (!apply) {
  console.log(`[dry-run] would upsert ${rows.length} products row(s):`);
  console.log(JSON.stringify(rows, null, 2));
  console.log('Pass --apply to write.');
  process.exit(0);
}

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required with --apply');
  process.exit(1);
}

const res = await fetch(`${url}/rest/v1/products?on_conflict=id`, {
  method: 'POST',
  headers: {
    apikey: key,
    Authorization: `Bearer ${key}`,
    'Content-Type': 'application/json',
    Prefer: 'resolution=merge-duplicates,return=minimal',
  },
  body: JSON.stringify(rows),
});
if (!res.ok) {
  console.error(`sync failed: ${res.status} ${await res.text()}`);
  process.exit(1);
}
console.log(`synced ${rows.length} products row(s)`);
