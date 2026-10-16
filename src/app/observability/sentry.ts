import { log } from './logger';

/**
 * Build-time values, injected by scripts/build.mjs through `ng build --define`.
 * angular.json defaults them to '' so an unset SENTRY_DSN means Sentry is never loaded.
 */
declare const SENTRY_DSN: string;
declare const SENTRY_ENVIRONMENT: string;

/** True only when a non-empty DSN was baked into the bundle. */
export function sentryEnabled(dsn: string | undefined): boolean {
  return typeof dsn === 'string' && dsn.trim().length > 0;
}

/** Loads and initialises Sentry only when SENTRY_DSN was set at build time. No-op otherwise. */
export async function initSentry(): Promise<void> {
  const dsn = typeof SENTRY_DSN === 'string' ? SENTRY_DSN : '';
  if (!sentryEnabled(dsn)) {
    return;
  }
  try {
    const Sentry = await import('@sentry/angular');
    Sentry.init({
      dsn,
      environment:
        typeof SENTRY_ENVIRONMENT === 'string' && SENTRY_ENVIRONMENT ? SENTRY_ENVIRONMENT : 'prod',
    });
  } catch (err) {
    log.warn('sentry init failed', { error: String(err) });
  }
}
