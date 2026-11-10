import { initials, safeReturnUrl, userFromClaims } from './auth.service';

describe('safeReturnUrl', () => {
  it('keeps same-site paths', () => {
    expect(safeReturnUrl('/account')).toBe('/account');
    expect(safeReturnUrl('/ideas/karagre?x=1')).toBe('/ideas/karagre?x=1');
  });

  it('rejects other origins and auth pages', () => {
    for (const bad of [
      null,
      '',
      'https://evil.example',
      '//evil.example',
      '/\\evil.example',
      '/sign-in',
      '/auth/callback?code=1',
    ]) {
      expect(safeReturnUrl(bad)).toBe('/');
    }
  });
});

describe('userFromClaims', () => {
  it('maps standard OIDC claims', () => {
    expect(
      userFromClaims({
        sub: 's',
        name: 'A B',
        email: 'a@b.co',
        email_verified: true,
        picture: 'p',
      }),
    ).toEqual({ sub: 's', name: 'A B', email: 'a@b.co', emailVerified: true, picture: 'p' });
  });

  it('returns null without a subject', () => {
    expect(userFromClaims({ email: 'a@b.co' })).toBeNull();
    expect(userFromClaims(null)).toBeNull();
  });
});

describe('initials', () => {
  const user = (name: string | null, email: string | null) => ({
    sub: 's',
    name,
    email,
    emailVerified: false,
    picture: null,
  });
  it('uses first and last name, else the email', () => {
    expect(initials(user('Asha Devi Rao', null))).toBe('AR');
    expect(initials(user(null, 'zed@example.com'))).toBe('Z');
    expect(initials(null)).toBe('?');
  });
});
