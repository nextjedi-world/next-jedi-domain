import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, AuthUser, RETURN_URL_KEY, safeReturnUrl } from './auth.service';

export const MOCK_USER_KEY = 'nj-mock-user';
export const MOCK_ACCESS_TOKEN = 'mock-access-token';

export const MOCK_USER: AuthUser = {
  sub: 'mock-user-1',
  name: 'Asha Rao',
  email: 'asha@example.com',
  emailVerified: true,
  picture: null,
};

function storage(): Storage | null {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

/** Dev-mock sign-in: no Identity round trip; the "session" is one localStorage key. */
@Injectable()
export class MockAuthService extends AuthService {
  private router = inject(Router);
  private readonly _user = signal<AuthUser | null>(null);
  private readonly _ready = signal(false);

  readonly user = this._user.asReadonly();
  readonly isAuthenticated = computed(() => this._user() !== null);
  readonly ready = this._ready.asReadonly();

  async init(): Promise<void> {
    this._user.set(storage()?.getItem(MOCK_USER_KEY) ? MOCK_USER : null);
    this._ready.set(true);
  }

  signIn(returnUrl = '/'): void {
    storage()?.setItem(MOCK_USER_KEY, '1');
    sessionStorage.setItem(RETURN_URL_KEY, safeReturnUrl(returnUrl));
    void this.router.navigateByUrl('/auth/callback');
  }

  async completeSignIn(): Promise<{ ok: boolean; returnUrl: string }> {
    await this.init();
    const returnUrl = safeReturnUrl(sessionStorage.getItem(RETURN_URL_KEY));
    sessionStorage.removeItem(RETURN_URL_KEY);
    return { ok: this.isAuthenticated(), returnUrl };
  }

  signOut(): void {
    storage()?.removeItem(MOCK_USER_KEY);
    this._user.set(null);
    void this.router.navigateByUrl('/');
  }

  async getAccessToken(): Promise<string | null> {
    return this._user() ? MOCK_ACCESS_TOKEN : null;
  }

  async refresh(): Promise<string | null> {
    return this.getAccessToken();
  }
}
