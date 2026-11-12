import { canReveal } from './reveal';

describe('canReveal', () => {
  const mm = (matches: boolean) => () => ({ matches }) as MediaQueryList;

  it('is true when observer exists and motion is allowed', () => {
    expect(canReveal({ IntersectionObserver: class {}, matchMedia: mm(true) })).toBe(true);
  });
  it('is false under reduced motion', () => {
    expect(canReveal({ IntersectionObserver: class {}, matchMedia: mm(false) })).toBe(false);
  });
  it('is false without IntersectionObserver', () => {
    expect(canReveal({ matchMedia: mm(true) })).toBe(false);
  });
});
