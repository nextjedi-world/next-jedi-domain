import { Signal } from '@angular/core';

/** The signed-in person, from the Identity ID token / userinfo. */
export interface AuthUser {
  sub: string;
  name: string | null;
  email: string | null;
  emailVerified: boolean;
  picture: string | null;
}

/** sessionStorage key for the page to return to after the Identity round trip. */
export const RETURN_URL_KEY = 'nj-auth-return-url';

/** Only same-site paths are allowed as a return URL (no open redirects). */
export function safeReturnUrl(url: string | null | undefined): string {
  if (!url || !url.startsWith('/') || url.startsWith('//') || url.startsWith('/\\')) return '/';
  if (url.startsWith('/auth/callback') || url.startsWith('/sign-in')) return '/';
  return url;
}

/**
 * Sign-in state for the whole app, as signals. OidcAuthService talks to NextJedi Identity
 * (OIDC Authorization Code + PKCE); MockAuthService fakes it for the dev mock.
 */
export abstract class AuthService {
  abstract readonly user: Signal<AuthUser | null>;
  abstract readonly isAuthenticated: Signal<boolean>;
  /** True once the stored session has been checked (the guard waits for this). */
  abstract readonly ready: Signal<boolean>;

  /** Restores the session if there is one. Never throws. */
  abstract init(): Promise<void>;
  /** Sends the browser to the Identity login page; comes back to `returnUrl`. */
  abstract signIn(returnUrl?: string): void;
  /** Finishes the code exchange on /auth/callback. Returns the page to go to. */
  abstract completeSignIn(): Promise<{ ok: boolean; returnUrl: string }>;
  abstract signOut(): void;
  /** Current access token, or null when signed out. */
  abstract getAccessToken(): Promise<string | null>;
  /** Uses the refresh token to get a new access token. Returns it, or null if that failed. */
  abstract refresh(): Promise<string | null>;
}

/** Maps OIDC claims (ID token or userinfo) to an AuthUser. */
export function userFromClaims(
  claims: Record<string, unknown> | null | undefined,
): AuthUser | null {
  if (!claims || typeof claims['sub'] !== 'string') return null;
  const str = (k: string) => (typeof claims[k] === 'string' ? (claims[k] as string) : null);
  return {
    sub: claims['sub'] as string,
    name: str('name'),
    email: str('email'),
    emailVerified: claims['email_verified'] === true,
    picture: str('picture'),
  };
}

/** Initials for the avatar: "Asha Rao" -> "AR", "asha@x.com" -> "A". */
export function initials(user: AuthUser | null): string {
  const source = user?.name?.trim() || user?.email?.trim() || '';
  if (!source) return '?';
  const parts = source.split(/[\s@._-]+/).filter(Boolean);
  if (user?.name && parts.length > 1) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return parts[0][0].toUpperCase();
}
