import { APPS } from './apps.config';
import { routes } from './app.routes';

describe('routes', () => {
  it('has a home route and a catch-all or app routes', () => {
    expect(routes.some((r) => r.path === '')).toBe(true);
  });

  it('registers a landing route for every configured app', () => {
    const paths = new Set(routes.map((r) => r.path));
    const slugs = Array.isArray(APPS) ? APPS.map((a) => a.slug) : Object.keys(APPS);
    for (const slug of slugs) {
      expect(paths.has(slug), `route for ${slug}`).toBe(true);
    }
  });
});
