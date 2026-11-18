import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { firstValueFrom } from 'rxjs';
import { log } from '../../observability/logger';
import {
  AuthService,
  AuthUser,
  RETURN_URL_KEY,
  safeReturnUrl,
  userFromClaims,
} from './auth.service';

/**
 * sessionStorage flag set while a session exists. Anonymous visitors (no flag, not on the
 * callback) never contact Identity, so most page views cost nothing.
 */
export const SESSION_FLAG = 'nj-auth-session';

/**
 * NextJedi Identity over OIDC Authorization Code + PKCE (S256), via angular-auth-oidc-client.
 * Tokens stay in sessionStorage (the library default); refresh uses the refresh token
 * (`offline_access`), both on a timer (silent renew) and on a 401 from platform-api.
 */
@Injectable()
export class OidcAuthService extends AuthService {
  private oidc = inject(OidcSecurityService);
  private router = inject(Router);

  private readonly _user = signal<AuthUser | null>(null);
  private readonly _ready = signal(false);
  private initPromise: Promise<void> | null = null;

  readonly user = this._user.asReadonly();
  readonly isAuthenticated = computed(() => this._user() !== null);
  readonly ready = this._ready.asReadonly();

  init(): Promise<void> {
    this.initPromise ??= this.check();
    return this.initPromise;
  }

  private async check(): Promise<void> {
    const onCallback = globalThis.location?.pathname.startsWith('/auth/callback') ?? false;
    if (!onCallback && !sessionStorage.getItem(SESSION_FLAG)) {
      this._ready.set(true);
      return;
    }
    try {
      const result = await firstValueFrom(this.oidc.checkAuth());
      if (result.isAuthenticated) {
        this._user.set(userFromClaims(result.userData) ?? { ...emptyUser(), sub: 'unknown' });
        sessionStorage.setItem(SESSION_FLAG, '1');
      } else {
        this.clearLocal();
        if (result.errorMessage) log.warn('sign-in check failed', { reason: result.errorMessage });
      }
    } catch (err) {
      log.warn('sign-in check failed', { error: String(err) });
      this.clearLocal();
    } finally {
      this._ready.set(true);
    }
  }

  signIn(returnUrl = '/'): void {
    sessionStorage.setItem(RETURN_URL_KEY, safeReturnUrl(returnUrl));
    this.oidc.authorize();
  }

  async completeSignIn(): Promise<{ ok: boolean; returnUrl: string }> {
    await this.init();
    const returnUrl = safeReturnUrl(sessionStorage.getItem(RETURN_URL_KEY));
    sessionStorage.removeItem(RETURN_URL_KEY);
    return { ok: this.isAuthenticated(), returnUrl };
  }

  signOut(): void {
    this.clearLocal();
    // Ends the Identity session too when the provider has an end_session_endpoint;
    // otherwise the library only clears the local tokens.
    this.oidc.logoff().subscribe({
      complete: () => void this.router.navigateByUrl('/'),
      error: () => void this.router.navigateByUrl('/'),
    });
  }

  async getAccessToken(): Promise<string | null> {
    if (!this._user()) return null;
    try {
      return (await firstValueFrom(this.oidc.getAccessToken())) || null;
    } catch {
      return null;
    }
  }

  async refresh(): Promise<string | null> {
    try {
      const result = await firstValueFrom(this.oidc.forceRefreshSession());
      if (result?.isAuthenticated && result.accessToken) return result.accessToken;
    } catch (err) {
      log.warn('token refresh failed', { error: String(err) });
    }
    this.clearLocal();
    return null;
  }

  private clearLocal(): void {
    sessionStorage.removeItem(SESSION_FLAG);
    this._user.set(null);
  }
}

function emptyUser(): AuthUser {
  return { sub: '', name: null, email: null, emailVerified: false, picture: null };
}
