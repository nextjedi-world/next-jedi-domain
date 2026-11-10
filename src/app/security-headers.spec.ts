import vercel from '../../vercel.json';

interface Header {
  key: string;
  value: string;
}
const rules = vercel.headers as { source: string; headers: Header[] }[];
const headers = new Map(
  rules.find((r) => r.source === '/(.*)')?.headers.map((h) => [h.key, h.value]),
);
const csp = headers.get('Content-Security-Policy') ?? '';
const directive = (name: string) =>
  csp
    .split(';')
    .map((d) => d.trim())
    .find((d) => d.startsWith(name + ' '));

describe('vercel.json security headers', () => {
  it('sets a CSP without unsafe-eval or unsafe-inline scripts', () => {
    expect(csp).not.toBe('');
    expect(csp).not.toContain('unsafe-eval');
    expect(directive('script-src')).not.toContain('unsafe-inline');
    expect(directive('default-src')).toBe("default-src 'self'");
  });

  it('allows the origins the site needs', () => {
    expect(directive('script-src')).toContain('https://checkout.razorpay.com');
    expect(directive('frame-src')).toContain('https://checkout.razorpay.com');
    expect(directive('frame-src')).toContain('https://api.razorpay.com');
    expect(directive('connect-src')).toContain('https://api.nextjedi.com');
    expect(directive('connect-src')).toContain('supabase.co');
    expect(directive('style-src')).toContain('https://fonts.googleapis.com');
    expect(directive('font-src')).toContain('https://fonts.gstatic.com');
    expect(directive('frame-ancestors')).toBe("frame-ancestors 'none'");
  });

  it('sets the standard security headers', () => {
    expect(headers.get('X-Content-Type-Options')).toBe('nosniff');
    expect(headers.get('Referrer-Policy')).toBe('strict-origin-when-cross-origin');
    expect(headers.get('X-Frame-Options')).toBe('DENY');
    expect(headers.get('Strict-Transport-Security')).toContain('max-age=63072000');
  });
});
