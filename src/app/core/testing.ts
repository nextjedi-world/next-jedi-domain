import { vi } from 'vitest';
import { computed, signal } from '@angular/core';
import { AuthService, AuthUser } from './auth/auth.service';
import { NjConfig } from './config';

/** Test helpers shared by the specs. Not imported by app code. */
export const TEST_CONFIG: NjConfig = {
  identityIssuer: 'http://localhost:4000',
  oidcClientId: 'nextjedi-web',
  platformApiUrl: 'http://localhost:4100',
  workspace: 'nextjedi',
  useMock: false,
};

export const TEST_USER: AuthUser = {
  sub: 'u1',
  name: 'Asha Rao',
  email: 'asha@example.com',
  emailVerified: true,
  picture: null,
};

/** A controllable AuthService for component, guard and interceptor tests. */
export class FakeAuthService extends AuthService {
  readonly userSig = signal<AuthUser | null>(null);
  readonly readySig = signal(true);
  token: string | null = 'access-1';
  refreshed: string | null = 'access-2';

  readonly user = this.userSig.asReadonly();
  readonly isAuthenticated = computed(() => this.userSig() !== null);
  readonly ready = this.readySig.asReadonly();

  init = vi.fn(async () => undefined);
  signIn = vi.fn();
  signOut = vi.fn();
  completeSignIn = vi.fn(async () => ({ ok: true, returnUrl: '/' }));
  getAccessToken = vi.fn(async () => (this.userSig() ? this.token : null));
  refresh = vi.fn(async () => this.refreshed);
}
