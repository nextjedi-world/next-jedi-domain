/**
 * Single source of truth for the sellable catalog. Each entry maps to one row in the
 * `products` table (see scripts/sync-products.mjs). The /pricing route reads PRODUCTS.
 * Prices are integer paise (INR). Entries below are PLACEHOLDERS until the owner sets the catalog.
 */
export type ProductKind = 'one_time';
export type ProductCurrency = 'INR';

export interface ProductConfig {
  id: string;
  name: string;
  description: string;
  /** Price in paise (1 INR = 100 paise). Must be an integer. */
  amount_paise: number;
  currency: ProductCurrency;
  kind: ProductKind;
  /** Slug of the app in apps.config.ts this product belongs to, if any. */
  appSlug?: string;
}

export const PRODUCTS: ProductConfig[] = [
  {
    id: 'placeholder-basic',
    name: 'Placeholder: Basic (replace)',
    description: 'Placeholder catalog entry. Replace with a real product.',
    amount_paise: 9900,
    currency: 'INR',
    kind: 'one_time',
  },
  {
    id: 'placeholder-pro',
    name: 'Placeholder: Pro (replace)',
    description: 'Placeholder catalog entry. Replace with a real product.',
    amount_paise: 49900,
    currency: 'INR',
    kind: 'one_time',
  },
];
