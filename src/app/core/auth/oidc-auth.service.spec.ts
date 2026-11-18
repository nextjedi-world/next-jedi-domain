import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { of, throwError } from 'rxjs';
import { RETURN_URL_KEY } from './auth.service';
import { OidcAuthService, SESSION_FLAG } from './oidc-auth.service';

describe('OidcAuthService', () => {
  let oidc: {
    checkAuth: ReturnType<typeof vi.fn>;
    authorize: ReturnType<typeof vi.fn>;
    logoff: ReturnType<typeof vi.fn>;
    getAccessToken: ReturnType<typeof vi.fn>;
    forceRefreshSession: ReturnType<typeof vi.fn>;
  };

  const make = () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        OidcAuthService,
        { provide: OidcSecurityService, useValue: oidc },
      ],
    });
    return TestBed.inject(OidcAuthService);
  };

  beforeEach(() => {
    sessionStorage.clear();
    oidc = {
      checkAuth: vi.fn(() =>
        of({
          isAuthenticated: true,
          userData: { sub: 'u1', name: 'Asha', email: 'asha@example.com', email_verified: true },
          accessToken: 'at',
          idToken: 'it',
          configId: 'c',
        }),
      ),
      authorize: vi.fn(),
      logoff: vi.fn(() => of(null)),
      getAccessToken: vi.fn(() => of('at')),
      forceRefreshSession: vi.fn(() => of({ isAuthenticated: true, accessToken: 'at2' })),
    };
  });

  it('does not contact Identity for visitors without a session', async () => {
    const auth = make();
    await auth.init();
    expect(oidc.checkAuth).not.toHaveBeenCalled();
    expect(auth.ready()).toBe(true);
    expect(auth.isAuthenticated()).toBe(false);
  });

  it('restores an existing session', async () => {
    sessionStorage.setItem(SESSION_FLAG, '1');
    const auth = make();
    await auth.init();
    expect(auth.user()?.email).toBe('asha@example.com');
    expect(await auth.getAccessToken()).toBe('at');
  });

  it('treats a failed check as signed out', async () => {
    sessionStorage.setItem(SESSION_FLAG, '1');
    oidc.checkAuth.mockReturnValue(throwError(() => new Error('discovery down')));
    const auth = make();
    await auth.init();
    expect(auth.isAuthenticated()).toBe(false);
    expect(sessionStorage.getItem(SESSION_FLAG)).toBeNull();
  });

  it('stores a safe return URL and starts the PKCE redirect', () => {
    const auth = make();
    auth.signIn('https://evil.example');
    expect(sessionStorage.getItem(RETURN_URL_KEY)).toBe('/');
    auth.signIn('/account');
    expect(sessionStorage.getItem(RETURN_URL_KEY)).toBe('/account');
    expect(oidc.authorize).toHaveBeenCalled();
  });

  it('refreshes with the refresh token, and signs out when that fails', async () => {
    sessionStorage.setItem(SESSION_FLAG, '1');
    const auth = make();
    await auth.init();
    expect(await auth.refresh()).toBe('at2');
    oidc.forceRefreshSession.mockReturnValue(of({ isAuthenticated: false }));
    expect(await auth.refresh()).toBeNull();
    expect(auth.isAuthenticated()).toBe(false);
  });

  it('signs out locally and at Identity', async () => {
    sessionStorage.setItem(SESSION_FLAG, '1');
    const auth = make();
    await auth.init();
    auth.signOut();
    expect(oidc.logoff).toHaveBeenCalled();
    expect(auth.isAuthenticated()).toBe(false);
    expect(await auth.getAccessToken()).toBeNull();
  });
});
