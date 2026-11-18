import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, delay, mergeMap, of, throwError, timer } from 'rxjs';
import { MOCK_ACCESS_TOKEN, MOCK_USER } from '../auth/mock-auth.service';
import { NJ_CONFIG, isPlatformApiUrl } from '../config';
import { CatalogProduct, SubmissionRequest } from '../platform-api.models';
import { MOCK_RESERVATIONS, MOCK_SUBMISSIONS, mockProducts } from './mock-data';

/** Response latency so loading states are visible. Tests set it to 0. */
export const mockSettings = { delayMs: 450 };

/** In-memory catalog, so a reservation bumps `claimed` for the rest of the session. */
let products: CatalogProduct[] | null = null;
function catalog(): CatalogProduct[] {
  products ??= mockProducts();
  return products;
}

/** Founder spots held, as `<email>|<product>`, so a repeat reserve is `already_reserved`. */
let reservations: Set<string> | null = null;
function held(): Set<string> {
  reservations ??= new Set(MOCK_RESERVATIONS.map((r) => reservationKey(r.email, r.product)));
  return reservations;
}
function reservationKey(email: string, product: string): string {
  return `${email.trim().toLowerCase()}|${product}`;
}

export function resetMockCatalog(): void {
  products = null;
  reservations = null;
}

/** The email behind the request's Bearer token (the dev mock has one user), or null. */
function callerEmail(req: HttpRequest<unknown>): string | null {
  const auth = req.headers.get('Authorization');
  if (!auth) return null;
  return auth === `Bearer ${MOCK_ACCESS_TOKEN}` ? MOCK_USER.email : null;
}

/** Like the real API: `offer.reserved` only when the request carries a Bearer token. */
function forCaller(product: CatalogProduct, email: string | null): CatalogProduct {
  if (!email || !product.offer) return product;
  return {
    ...product,
    offer: { ...product.offer, reserved: held().has(reservationKey(email, product.id)) },
  };
}

/**
 * Test hooks for the error states (dev mock only). A name or email containing one of these
 * words makes POST /v1/submissions fail that way:
 *   ratelimit -> 429, servererror -> 500, invalid -> 400 with `fields`.
 * `?mockCatalog=empty` or `?mockCatalog=error` on the page URL does the same for the catalog.
 * The mock user (asha@example.com) already holds the Karagre founder spot, so signing in shows
 * the "already reserved" card there; reserving again with any email returns `already_reserved`.
 */
function submissionScenario(body: SubmissionRequest | null): string | null {
  const text = `${body?.email ?? ''} ${body?.name ?? ''}`.toLowerCase();
  return ['ratelimit', 'servererror', 'invalid'].find((s) => text.includes(s)) ?? null;
}

function catalogScenario(): string | null {
  try {
    return new URLSearchParams(globalThis.location?.search ?? '').get('mockCatalog');
  } catch {
    return null;
  }
}

function ok<T>(body: T, status = 200): Observable<HttpResponse<T>> {
  // A copy, like a real response, so signals see new objects.
  return of(new HttpResponse({ status, body: structuredClone(body) })).pipe(
    delay(mockSettings.delayMs),
  );
}

function fail(url: string, status: number, error: unknown): Observable<never> {
  return timer(mockSettings.delayMs).pipe(
    mergeMap(() => throwError(() => new HttpErrorResponse({ status, error, url }))),
  );
}

function validate(body: SubmissionRequest | null): Record<string, string> {
  const fields: Record<string, string> = {};
  if (!body?.kind) fields['kind'] = 'required';
  if (body?.kind !== 'idea' && !body?.email) fields['email'] = 'required';
  if (body?.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    fields['email'] = 'invalid_email';
  }
  if ((body?.name ?? '').length > 100) fields['name'] = 'too_long';
  if ((body?.message ?? '').length > 5000) fields['message'] = 'too_long';
  return fields;
}

function handleSubmission(req: HttpRequest<unknown>): Observable<HttpResponse<unknown>> {
  const body = req.body as SubmissionRequest | null;
  const scenario = submissionScenario(body);
  if (scenario === 'ratelimit') return fail(req.url, 429, { error: 'rate_limited' });
  if (scenario === 'servererror') return fail(req.url, 500, { error: 'internal' });
  if (scenario === 'invalid') {
    return fail(req.url, 400, { error: 'validation', fields: { email: 'invalid_email' } });
  }
  const fields = validate(body);
  if (Object.keys(fields).length) return fail(req.url, 400, { error: 'validation', fields });
  if (body?.kind === 'early_adopter' && body.product && body.email && !body.website) {
    const key = reservationKey(body.email, body.product);
    if (held().has(key)) return ok({ id: crypto.randomUUID(), status: 'already_reserved' }, 200);
    const offer = catalog().find((p) => p.id === body.product)?.offer;
    if (offer && offer.claimed < offer.cap) {
      offer.claimed += 1;
      held().add(key);
    }
  }
  return ok({ id: crypto.randomUUID(), status: 'received' }, 201);
}

/** Serves platform-api from the contract JSON when `useMock` is on. Off: passes through. */
export const mockApiInterceptor: HttpInterceptorFn = (req, next) => {
  const config = inject(NJ_CONFIG);
  if (!config.useMock || !isPlatformApiUrl(req.url, config)) return next(req);

  const path = new URL(req.url).pathname;

  if (req.method === 'GET' && path === '/v1/catalog') {
    const scenario = catalogScenario();
    if (scenario === 'error') return fail(req.url, 503, { error: 'unavailable' });
    const email = callerEmail(req);
    return ok({
      workspace: config.workspace,
      products: scenario === 'empty' ? [] : catalog().map((p) => forCaller(p, email)),
    });
  }
  const one = /^\/v1\/catalog\/([^/]+)$/.exec(path);
  if (req.method === 'GET' && one) {
    const product = catalog().find((p) => p.id === decodeURIComponent(one[1]));
    return product
      ? ok(forCaller(product, callerEmail(req)))
      : fail(req.url, 404, { error: 'not_found' });
  }
  if (req.method === 'POST' && path === '/v1/submissions') return handleSubmission(req);
  if (path.startsWith('/v1/me/')) {
    if (!req.headers.has('Authorization')) return fail(req.url, 401, { error: 'unauthorized' });
    if (path === '/v1/me/submissions') return ok({ submissions: MOCK_SUBMISSIONS });
    if (path === '/v1/me/entitlements') {
      const product = req.params.get('product');
      return ok({
        product,
        entitlements:
          product === 'karagre'
            ? [{ key: 'founder', active: true, source: 'manual', expiresAt: null }]
            : [],
      });
    }
  }
  return fail(req.url, 404, { error: 'not_found' });
};
