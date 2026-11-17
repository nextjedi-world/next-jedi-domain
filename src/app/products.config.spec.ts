import { PRODUCTS } from './products.config';

describe('PRODUCTS', () => {
  it('has at least one entry', () => {
    expect(PRODUCTS.length).toBeGreaterThan(0);
  });

  it('uses integer, positive amount_paise', () => {
    for (const p of PRODUCTS) {
      expect(Number.isInteger(p.amount_paise), p.id).toBe(true);
      expect(p.amount_paise, p.id).toBeGreaterThan(0);
    }
  });

  it('is one_time and INR', () => {
    for (const p of PRODUCTS) {
      expect(p.kind, p.id).toBe('one_time');
      expect(p.currency, p.id).toBe('INR');
    }
  });

  it('has unique ids', () => {
    const ids = PRODUCTS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
