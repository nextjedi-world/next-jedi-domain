/** platform-api shapes from the Phase 1 contract (nextjedi-phase1-contract.md). */

export type ProductStatus = 'live' | 'beta' | 'building' | 'idea';
export type ProductPlatform = 'android' | 'ios' | 'web';

export interface ProductOffer {
  id: string;
  kind: string;
  title: string;
  perks: string[];
  cap: number;
  claimed: number;
  priceInr: number | null;
  currency: string;
  /** Always false in Phase 1: price is not set yet. */
  purchasable: boolean;
}

export interface CatalogProduct {
  id: string;
  name: string;
  tagline: string;
  summary: string;
  status: ProductStatus;
  platforms: ProductPlatform[];
  url: string | null;
  imageUrl: string | null;
  offer: ProductOffer | null;
}

export interface CatalogResponse {
  workspace: string;
  products: CatalogProduct[];
}

export type SubmissionKind = 'waitlist' | 'early_adopter' | 'idea' | 'support' | 'tester';

export interface SubmissionRequest {
  kind: SubmissionKind;
  product?: string;
  name?: string;
  email?: string;
  message?: string;
  platform?: ProductPlatform;
  /** Honeypot. Real people leave it empty. */
  website?: string;
  turnstileToken?: string;
}

export interface SubmissionResponse {
  id: string;
  status: 'received';
}

export interface MySubmission {
  id: string;
  kind: SubmissionKind;
  product: string | null;
  createdAt: string;
}

export interface MySubmissionsResponse {
  submissions: MySubmission[];
}

export interface Entitlement {
  key: string;
  active: boolean;
  source: string;
  expiresAt: string | null;
}

export interface EntitlementsResponse {
  product: string;
  entitlements: Entitlement[];
}
