import { buildRecord, PRODUCT_ID } from './logger';
import { sentryEnabled } from './sentry';

describe('logger', () => {
  it('builds a structured record with product and timestamp', () => {
    const rec = buildRecord('info', 'hello', { route: '/team' }, new Date('2026-01-02T03:04:05Z'));
    expect(rec).toEqual({
      route: '/team',
      level: 'info',
      msg: 'hello',
      ts: '2026-01-02T03:04:05.000Z',
      product: PRODUCT_ID,
    });
  });
});

describe('sentryEnabled', () => {
  it('is off when the DSN is unset or blank', () => {
    expect(sentryEnabled(undefined)).toBe(false);
    expect(sentryEnabled('')).toBe(false);
    expect(sentryEnabled('   ')).toBe(false);
  });
  it('is on when a DSN is set', () => {
    expect(sentryEnabled('https://key@o0.ingest.sentry.io/1')).toBe(true);
  });
});
